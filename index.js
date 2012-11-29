var fs = require('fs');
var sendgrid = require('sendgrid');


//==============================================================================
exports.open = function(options) {
  var user = options.user;
  var key = options.key;
  return {
    send: function(email, users, callback) {
      send(user, key, email, users, callback);
    }
  }
}

//==============================================================================
function send(user, key, email, users, cb) {
  
  var sender = new sendgrid.SendGrid(user, key);  
  var currentIndex = 0;
  var callbackCountdown = 0;
    
  function callback(success, message) {
    cb && cb(success, message, --callbackCountdown === 0);    
    if (currentIndex < users.length)
      sendBatch();
  }

  function sendBatch() {
    
    var batchEmail = new sendgrid.Email(email);
    var batchTo = [];
    var batchSub = {};
    var user, mustacheVar, value;
    
    for (mustacheVar in email.mustacheVars)
      batchSub[mustacheVar] = [];
    
    while (currentIndex < users.length && batchTo.length < 1000) {
      user = users[currentIndex];
      batchTo.push(user.email);
      for (mustacheVar in email.mustacheVars) {
        value = user[mustacheVar];
        batchSub[mustacheVar].push(value == null ? '' : value);
      }
      currentIndex++;
    }    
    
    for (mustacheVar in batchSub)
      batchEmail.addSubVal('{{' + mustacheVar + '}}', batchSub[mustacheVar]);      
    batchEmail.addTo(batchTo);
    
    callbackCountdown++;
    sender.send(batchEmail, callback);    
    
  }
    
  Array.isArray(users) || (users = [users]);      
  initMustache(email);  
  sendBatch();
  
}

//==============================================================================
function initMustache(email) {  
  
  var mustacheVarReg = /\{\{\s*([^\{\}\s]+)\s*\}\}/g;  
  var match, i, mustacheVar;
  
  if (email.textTemplate)
    email.text = fs.readFileSync(email.textTemplate, 'utf8');
  if (email.htmlTemplate)
    email.html = fs.readFileSync(email.htmlTemplate, 'utf8');  
  
  if (email.text)
    email.text = email.text.replace(mustacheVarReg, '{{$1}}');
  if (email.html)
    email.html = email.html.replace(mustacheVarReg, '{{$1}}');  
  
  email.mustacheVars = {};
  match = (email.html || email.text).match(mustacheVarReg);
  if (match)
    for (i = 0; mustacheVar = match[i]; i++)
      email.mustacheVars[mustacheVar.substring(2, mustacheVar.length - 2)] = 1;    
  
}




