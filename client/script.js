const req = new XMLHttpRequest();
req.open('GET', 'https://nsk.execution.su:8443/sapui5chat/chat-template.html', true);
req.onreadystatechange = () => {
  if (req.readyState === 4) {
    if (req.status === 200) {
      console.log(req.responseText);
    } else {
      console.log('Error loading page\n');
    }
  }
};
req.send(null);
