export function createNotionItem(notion) {
    const li = document.createElement('li');
    li.id = `li-${notion.id}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = notion.id;

    const label = document.createElement('label');
    label.htmlFor = notion.id;
    label.innerHTML = notion.html;

    li.append(checkbox, label);
    return li;
}
