name: Generate Changelog

on:
  release:
    types: [created]

jobs:
  changelog:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'

      - name: Install github_changelog_generator
        run: gem install github_changelog_generator

      - name: Generate CHANGELOG.md in /Package
        env:
          CHANGELOG_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          mkdir -p Package
          github_changelog_generator \
            -u ${{ github.repository_owner }} \
            -p ${{ github.event.repository.name }} \
            --output Package/CHANGELOG.md

      - name: Commit and push changelog
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add Package/CHANGELOG.md
          git commit -m "Update CHANGELOG for release ${{ github.event.release.tag_name }}"
          git push