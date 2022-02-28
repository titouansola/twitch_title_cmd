import $ from 'jquery';

function searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
    try {
        if (predicate(node)) {
            return node;
        }
    } catch (_) {}

    if (!node || depth > maxDepth) {
        return null;
    }

    const {return: parent} = node;
    if (parent) {
        return searchReactParents(parent, predicate, maxDepth, depth + 1);
    }

    return null;
}

function getReactInstance(element) {
    for (const key in element) {
        if (key.startsWith('__reactInternalInstance$')) {
            return element[key];
        }
    }

    return null;
}

function getCurrentChat() {
    let currentChat;
    try {
        const node = searchReactParents(
            getReactInstance($('section')[0]),
            (n) => n.stateNode && n.stateNode.props && n.stateNode.props.onSendMessage
        );
        currentChat = node.stateNode;
    } catch (_) {}

    return currentChat;
}

function setCommands(streamTitle) {
    const commands = streamTitle.innerText.match(/![0-z]*/g);
    let innerHTML = '' + streamTitle.innerHTML;
    commands.forEach((cmd) => {
        innerHTML = innerHTML.replace(cmd, `<b class="ttc-clickable-command">${cmd}</b>`);
    });
    streamTitle.innerHTML = innerHTML;
}

function run(streamTitle) {
    setCommands(streamTitle);
    const sendMessage = getCurrentChat().props.onSendMessage;
    const clickableCmds = Array.from(document.getElementsByClassName('ttc-clickable-command'));

    clickableCmds.forEach((cmd) => {
        cmd.style.fontWeight = 'bold';
        cmd.style.color = '#772ce8';
        cmd.style.cursor = 'pointer';
        cmd.addEventListener('click', () => {
            sendMessage(cmd.innerText);
        });
    });
}

const tick = setInterval(function () {
    console.log('TTC Tick');
    const h2Elt = document.getElementsByTagName('h2')[0];
    if (!!h2Elt) {
        console.log('TTC OK');
        clearInterval(tick);
        run(h2Elt);
    }
}, 1000);
