export function createNotionItem(notion) {
    const li = document.createElement('li');
    li.id = `li-${notion.id}`;
    li.dataset.notionId = notion.id;

    const label = document.createElement('label');
    label.className = 'notion-label';
    label.htmlFor = notion.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = notion.id;

    const content = document.createElement('span');
    content.className = 'notion-content';
    content.innerHTML = notion.html;

    label.append(checkbox, content);
    li.append(label);
    return li;
}
