import os
import re
import yaml
from datetime import datetime

KNOWLEDGE_DIR = "docs/knowledge"
README_PATH = "README.md"

def parse_frontmatter(content):
    """แยก frontmatter กับ body ออกจากกัน"""
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = yaml.safe_load(parts[1])
            body = parts[2].strip()
            return frontmatter, body
    return {}, content

def get_all_knowledge():
    items = []
    for filename in os.listdir(KNOWLEDGE_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(KNOWLEDGE_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            meta, body = parse_frontmatter(content)

            items.append({
                'title': meta.get('title', filename.replace('.md', '')),
                'category': meta.get('category', 'General'),
                'desc': meta.get('desc', ''),
                'file': filename,
                'body': body[:200] + '...' if len(body) > 200 else body
            })

    # เรียงตาม category แล้วตาม title
    return sorted(items, key=lambda x: (x['category'], x['title']))

def generate_knowledge_md(items):
    if not items:
        return "_ยังไม่มีเอกสาร_"

    # จัดกลุ่มตาม category
    categories = {}
    for item in items:
        cat = item['category']
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(item)

    md = []
    for cat, cat_items in sorted(categories.items()):
        md.append(f"\n### {cat}")
        for item in cat_items:
            link = f"docs/knowledge/{item['file']}"
            md.append(f"- **[{item['title']}]({link})**: {item['desc']}")

    md.append(f"\n\n_อัปเดตล่าสุด: {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}_")
    return '\n'.join(md)

def update_readme():
    items = get_all_knowledge()
    knowledge_md = generate_knowledge_md(items)

    with open(README_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(
        r'<!-- KNOWLEDGE-START -->.*<!-- KNOWLEDGE-END -->',
        f'<!-- KNOWLEDGE-START -->\n{knowledge_md}\n<!-- KNOWLEDGE-END -->',
        content,
        flags=re.DOTALL
    )

    with open(README_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Updated README with {len(items)} knowledge items")

if __name__ == "__main__":
    update_readme()