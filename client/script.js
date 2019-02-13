(() => {
  function getAllScripts(el) {
    const scripts = [];
    let ch = el.firstElementChild;
    while (ch) {
      const nextCh = ch.nextElementSibling;
      if (ch.tagName.toLowerCase() === 'script') {
        scripts.push(ch);
        ch.remove();
      }
      ch = nextCh;
    }
    return scripts;
  }

  function insertScriptAsync(script, target, callback) {
    const scriptElement = document.createElement('script');
    const scriptSrc = script.getAttribute('src');
    if (scriptSrc) {
      scriptElement.src = scriptSrc;
    } else {
      scriptElement.text = script.text;
    }
    target.appendChild(scriptElement);
    if (scriptSrc) {
      scriptElement.onload = callback;
    } else {
      callback();
    }
  }

  function insertScriptsAsync(scripts, target, callback) {
    const [script, ...otherScripts] = scripts;
    if (!script) {
      callback();
      return;
    }
    insertScriptAsync(script, target, () => {
      insertScriptsAsync(otherScripts, target, callback);
    });
  }

  function xhrGet(url, callback) {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status === 200) {
          callback(null, req);
        } else {
          callback(new Error('XMLHttpRequest error'));
        }
      }
    };
    req.send(null);
  }

  xhrGet(
    'https://nsk.execution.su:8443/sapui5chat/chat-template.html',
    (err, req) => {
      if (err) {
        console.error('Error loading page\n');
        return;
      }
      const body = document.getElementsByTagName('body')[0];
      const chatContainerElement = document.createElement('div');
      chatContainerElement.innerHTML = req.responseText;
      const chatElement = chatContainerElement.firstElementChild;

      const allScripts = getAllScripts(chatElement);
      insertScriptsAsync(allScripts, chatElement, () => {
        console.log('sapui5chat inject done');
      });
      body.appendChild(chatElement);
    },
  );
})();
