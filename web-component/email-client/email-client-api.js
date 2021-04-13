import environment from "../../../src/environment";
import {ApiGateway} from "../../api/api-gateway";
import {SharedClass} from "../../../src/shared/shared";

export class EmailClientApi {

  constructor() {
    this.api = new ApiGateway();
    this.shared = new SharedClass();
    this.baseUrl = environment.endpoint;
  }

  getUserAccounts() {
    this.api.apiRequest(`${this.baseUrl}/api/user/active/emails`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('user-active-email-received', {bubbles: true, detail: jsonData}));
      });
  }

  getUserMessages(accountId, type, labelId, pageNo) {
    window.dispatchEvent(new CustomEvent('get-email-request-sent', {bubbles: true}));
    let data = {
      'idEmailAccount': accountId,
      'messageType': type,
      'labelId': labelId,
      'page': pageNo,
    };
    this.api.apiRequest(`${this.baseUrl}/api/user/email/messages`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('email-messages-received', {
          bubbles: true, detail: {
            data: jsonData,
            type: type
          }
        }));
      });
  }

  getMessage(id) {
    this.api.apiRequest(`${this.baseUrl}/api/user/inbox/message/${id}/details`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('emil-message-received', {bubbles: false, detail: jsonData}));
      });
  }

  updateStatus(data) {
    let body = {
      userId: data.id_user,
      emailAccountId: data.id_email_account,
      messageId: data.id_message
    };
    this.api.apiRequest(`${this.baseUrl}/api/user/message/status`, 'post', 'fetch', body)
      .then(result => result.json())
      .then(jsonData => {
      });
  }

  markAsStared(data) {
    this.api.apiRequest(`${this.baseUrl}/api/user/message/mark/star`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        if (jsonData) {
          window.dispatchEvent(new CustomEvent('get-email-messages'));
        }
      });
  }

  unMarkAsStar(data) {
    this.api.apiRequest(`${this.baseUrl}/api/user/message/mark/not/star`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        if (jsonData) {
          window.dispatchEvent(new CustomEvent('get-email-messages'));
        }
      });
  }

  performAction(data) {
    this.api.apiRequest(`${this.baseUrl}/api/user/messages/perform-action`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        if (jsonData) {
          this.getUserMessages(data.messages[0].emailAccountId, data.messages[0].type, undefined, data.messages[0].currentPage);
        }
      });
  }

  getMultipleAccountLabels() {
    this.api.apiRequest(`${this.baseUrl}/api/user/multiple/accounts/label`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('user-multiple-account-labels-received', {
          bubbles: true,
          detail: jsonData
        }));
      });
  }

  accountLabels(id) {
    this.api.apiRequest(`${this.baseUrl}/api/user/emailAccountId/${id}/labels/name`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('user-labels-received', {bubbles: true, detail: jsonData}));
      });
  }

  getAttachments(id, email_account_id) {
    let data = {
      idEmailAccount: email_account_id,
      idMessage: id
    };
    this.api.apiRequest(`${this.baseUrl}/api/user/email/attachment`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('email-attachment-received', {bubbles: true, detail: jsonData}));
      });
  }

  downloadFile(id, name, email_account_id) {
    fetch(`${this.baseUrl}/api/user/emailAccount/${email_account_id}/attachment/${id}`)
      .then(resp => resp.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name + "." + name.split('.')[1];
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('Error Downloading File'));
  }

  fetchMessages() {
    this.fetchNewMessageInterval = setInterval(function () {
      let data = {};
      this.api.apiRequest(`${this.baseUrl}/api/user/fetch/new/messages`, 'post', 'fetch', data)
        .then(result => result.json())
    }.bind(this), 80000);
  }

  disconnectedCallback() {
    clearInterval(this.fetchNewMessageInterval);
  }

  sendEmail(body) {
    this.api.apiRequest(`${this.baseUrl}/api/user/email`, 'post', 'file', body)
      .then(result => result.json())
      .then(jsonData => {
        if (jsonData) {
          window.dispatchEvent(new CustomEvent('email-message-sent'));
        }
      });
  }

  messagePerPage() {
    this.api.apiRequest(`${this.baseUrl}/api/user/email/page/size`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        if (jsonData.status) {
          window.dispatchEvent(new CustomEvent('user-email-page-size-received', {
            bubbles: true,
            detail: jsonData.pageSize
          }));
        } else {
          window.dispatchEvent(new CustomEvent('user-email-page-size-received', {bubbles: true, detail: 20}));
        }
      });
  }

  changeEmailPerPage(body) {
    let data = {
      conversationPageSize: body.conversationPageSize
    }
    this.api.apiRequest(`${this.baseUrl}/api/user/email/page/size`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('email-conversation-per-page-updated'));
      });
  }

  getUserEmail() {
    this.api.apiRequest(`${this.baseUrl}/api/user/email`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('user-email-address-received', {bubbles: false, detail: jsonData}));
      });
  }

  getConfiguredAccounts() {
    this.api.apiRequest(`${this.baseUrl}/api/user/configured/accounts`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('user-configured-accounts-received', {bubbles: true, detail: jsonData}));
      });
  }

  deleteUserAccount(id) {
    let data = {
      id: id
    }
    this.api.apiRequest(`${this.baseUrl}/api/configured/account/delete`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        this.getConfiguredAccounts();
      });
  }

  configureUser(data) {
    let body = {
      accountType: data.accountType,
      incomingMailServer: data.incomingMailServer,
      incomingServerPort: data.incomingServerPort,
      outgoingMailServer: data.outgoingMailServer,
      outgoingServerPort: data.outgoingServerPort,
      userEmail: data.userEmail,
      userPassword: data.userPassword
    }
    this.api.apiRequest(`${this.baseUrl}/api/user/configuration`, 'post', 'fetch', body)
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('user-configuration-response-received', {
          bubbles: true,
          detail: jsonData
        }));
      });
  }

  updateUserConfiguration(updatedData, data) {
    data.account_type = updatedData.accountType;
    data.incoming_server = updatedData.incomingMailServer;
    data.incoming_port = updatedData.incomingServerPort;
    data.outgoing_server = updatedData.outgoingMailServer;
    data.outgoing_port = updatedData.outgoingServerPort;
    data.password = updatedData.userPassword
    data.user_name = updatedData.userEmail
    this.api.apiRequest(`${this.baseUrl}/api/configured/account/update`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        if (jsonData) {
          window.dispatchEvent(new CustomEvent('configured-email-account-clicked'))
          this.getConfiguredAccounts();
        }
      });
  }

  getMessageDetails(id) {
    this.api.apiRequest(`${this.baseUrl}/api/user/inbox/message/${id}/details`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('email-message-detail-received', {bubbles: true, detail: jsonData}));
      });
  }

  getMessageAttachments(messageId, emailMessageId) {
    let data = {
      idEmailAccount: emailMessageId,
      idMessage: messageId
    };
    this.api.apiRequest(`${this.baseUrl}/api/user/email/attachment`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('user-email-attachments-received', {bubbles: true, detail: jsonData}));
      });
  }
}
