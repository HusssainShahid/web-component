export class MailServer {

  constructor(mailServer) {
    if (/^((\*)|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|((\*\.)?([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,63}?))$/.test(mailServer)) {
      this.mailServer = mailServer;
    } else {
      throw "Please enter valid Mail Server";
    }
  }

  value() {
    return this.mailServer;
  }
}
