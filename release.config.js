module.exports = {
  branches: [
    { name: 'main', channel: 'latest' },
    { name: 'develop', prerelease: 'beta', channel: 'beta' }
  ],
  tagFormat: 'v${version}',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'style', release: false },
          { type: 'test', release: false },
          { type: 'chore', release: false },
          { type: 'ci', release: false },
          { breaking: true, release: 'major' }
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: '✨ ฟีเจอร์ใหม่' },
            { type: 'fix', section: '🐛 แก้ไขปัญหา' },
            { type: 'perf', section: '⚡ ประสิทธิภาพ' },
            { type: 'refactor', section: '🔧 ปรับปรุงโค้ด' },
            { type: 'docs', section: '📄 เอกสาร' },
            { type: 'ci', section: '🤖 ระบบอัตโนมัติ', hidden: true },
            { type: 'chore', section: 'อื่นๆ', hidden: true }
          ]
        }
      }
    ],
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md', changelogTitle: '# 📝 CHANGELOG — CrystalCastle' }],
    ['@semantic-release/npm', { npmPublish: false }],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'pnpm-lock.yaml', 'CHANGELOG.md', 'README.md'],
        message: 'chore(release): ${nextRelease.version} 🚀 [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    ['@semantic-release/github', { releasedLabels: ['🚀 released'] }]
  ]
};
