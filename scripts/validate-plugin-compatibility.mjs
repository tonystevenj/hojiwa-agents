import assert from 'node:assert/strict';
import { lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const schema = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const sync = process.argv.slice(2);
assert.ok(sync.length === 0 || (sync.length === 1 && sync[0] === '--sync'),
  'Usage: node scripts/validate-plugin-compatibility.mjs [--sync]');

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function contained(base, path) {
  const target = resolve(base, path);
  const resolved = relative(realpathSync(base), realpathSync(target));
  assert.ok(!isAbsolute(resolved) && resolved !== '..' && !resolved.startsWith(`..${sep}`),
    `${target} must remain inside ${base}`);
  return target;
}

function read(base, path) {
  const target = contained(base, path);
  assert.ok(lstatSync(target).isFile(), `${target} must be a regular file, not a symlink`);
  return readFileSync(target, 'utf8').replaceAll('\r\n', '\n');
}

function json(path) {
  const value = JSON.parse(read(root, path));
  assert.ok(object(value), `${path} must contain a JSON object`);
  return value;
}

function manifest(value) {
  assert.equal(value.$schema, schema, 'Declare the Agent Plugins 1.0.0 schema');
  assert.equal(typeof value.name, 'string', 'Plugin name must be a string');
  assert.ok(value.name.length <= 64, 'Plugin name must not exceed 64 characters');
  assert.match(value.name, /^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/);
  const strings = ['version', 'description', 'homepage', 'repository', 'license'];
  const fields = ['$schema', 'name', ...strings, 'author', 'keywords', 'extensions'];
  for (const key of Object.keys(value)) {
    assert.ok(fields.includes(key), `Unknown portable manifest field: ${key}`);
  }
  for (const key of strings) {
    if (key in value) assert.equal(typeof value[key], 'string', `${key} must be a string`);
  }
  if ('author' in value) {
    assert.ok(object(value.author), 'author must be an object');
    for (const [key, field] of Object.entries(value.author)) {
      assert.ok(['name', 'email', 'url'].includes(key), `Unknown author field: ${key}`);
      assert.equal(typeof field, 'string', `author.${key} must be a string`);
    }
  }
  if ('keywords' in value) {
    assert.ok(Array.isArray(value.keywords), 'keywords must be an array');
    assert.ok(value.keywords.every(item => typeof item === 'string'), 'keywords must contain strings');
  }
  if ('extensions' in value) {
    assert.ok(object(value.extensions), 'extensions must be an object');
    assert.ok(Object.values(value.extensions).every(object), 'extension values must be objects');
  }
}

function links(base, path, text) {
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#')) continue;
    contained(base, relative(base, resolve(base, dirname(path), target.split('#')[0])));
  }
}

const legacy = json('.claude-plugin/marketplace.json');
const portable = json('.agents/plugins/marketplace.json');
assert.equal(legacy.name, 'hojiwa-agents', 'Preserve the marketplace identity');
assert.equal(portable.name, legacy.name, 'Marketplace identities must match');
assert.ok(Array.isArray(legacy.plugins), 'Legacy catalog must contain a plugins array');
assert.ok(Array.isArray(portable.plugins), 'Portable catalog must contain a plugins array');
const names = legacy.plugins.map(entry => entry.name).sort();
assert.equal(new Set(names).size, names.length, 'Duplicate legacy plugin identity');
assert.deepEqual(portable.plugins.map(entry => entry.name).sort(), names, 'Catalog entries must match');
assert.deepEqual(readdirSync(resolve(root, 'plugins')).sort(), names, 'Every package must appear in both catalogs');

for (const entry of legacy.plugins) {
  const path = `plugins/${entry.name}`;
  assert.equal(entry.source, `./${path}`, 'Preserve the plugin source path');
  const base = contained(root, path);
  assert.ok(lstatSync(base).isDirectory(), `${path} must be a regular directory`);
  const canonical = json(`${path}/plugin.json`);
  manifest(canonical);
  assert.equal(canonical.name, entry.name, 'Plugin identities must match');
  const { $schema, ...metadata } = canonical;
  assert.deepEqual(json(`${path}/.claude-plugin/plugin.json`), { ...metadata, agents: './agents' },
    `${path}: legacy metadata or agent location differs`);
  for (const key of ['version', 'description']) {
    assert.equal(typeof canonical[key], 'string', `${path}: ${key} is required`);
    assert.equal(entry[key], canonical[key], `${path}: marketplace ${key} differs`);
  }
  const match = portable.plugins.find(plugin => plugin.name === entry.name);
  assert.deepEqual(match.source, { source: 'local', path: `./${path}` }, 'Catalog source paths must match');
  assert.deepEqual(match.policy, { installation: 'AVAILABLE', authentication: 'ON_INSTALL' });
  assert.equal(match.category, 'Productivity');

  const agents = readdirSync(contained(base, 'agents'));
  assert.equal(agents.length, 1, `${path}: expected one source agent`);
  assert.ok(agents[0].endsWith('.agent.md'), `${path}: expected a Copilot agent filename`);
  const source = read(base, `agents/${agents[0]}`);
  const frontmatter = source.match(/^---\nname: ([^\n]+)\ndescription: [^\n]+\ntools: \['\*'\]\n---\n/);
  assert.ok(frontmatter, `${path}: expected named agent with unrestricted tool selection`);
  const name = frontmatter[1];
  const native = 'com.github.copilot/agents';
  if (sync.length) {
    contained(base, '.');
    for (const directory of ['com.github.copilot', native]) {
      mkdirSync(resolve(base, directory), { recursive: true });
      contained(base, directory);
      assert.ok(lstatSync(resolve(base, directory)).isDirectory(), `${directory} must be a regular directory`);
    }
    const target = resolve(base, native, agents[0]);
    if (readdirSync(resolve(base, native)).includes(agents[0])) read(base, `${native}/${agents[0]}`);
    writeFileSync(target, source);
  }
  assert.deepEqual(readdirSync(contained(base, native)), agents, `${path}: native agent set differs`);
  assert.equal(read(base, `${native}/${agents[0]}`), source, `${path}: native agent copy differs; run with --sync`);

  assert.deepEqual(readdirSync(contained(base, 'skills')), [name], `${path}: expected one portable skill`);
  const skillPath = `skills/${name}/SKILL.md`;
  const skill = read(base, skillPath);
  const skillMetadata = skill.match(/^---\nname: ([^\n]+)\ndescription: ([^\n]+)\n---\n/);
  assert.ok(skillMetadata, `${path}: skill must declare only name and description`);
  assert.equal(skillMetadata[1], name);
  assert.ok(name.length <= 64 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name), 'Invalid skill name');
  assert.ok(skillMetadata[2].trim().length > 0 && skillMetadata[2].length <= 1024, 'Invalid skill description');
  assert.ok(skill.includes(`](../../agents/${agents[0]})`), `${path}: skill must link the full source instructions`);
  links(base, skillPath, skill);
  links(base, `agents/${agents[0]}`, source);
  links(base, `${native}/${agents[0]}`, source);
  links(root, `${path}/README.md`, read(base, 'README.md'));
}
links(root, 'README.md', read(root, 'README.md'));
console.log(`Validated ${names.length} plugins: manifests, catalogs, skill entry points, agent copies, and local links.`);
