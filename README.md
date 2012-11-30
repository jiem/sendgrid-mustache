# sendgrid-mustache

The most efficient way to use mustache templates with SendGrid: send 1000 mustache mails with only 1 POST request.  
   
Instead of sending 1000 rendered mustache mails (with different `html` properties) through 1000 POST requests,
we map mustache variables to the SendGrid X-SMTPAPI so that the same job is done with only 1 POST request.

## Installation

    npm install sendgrid-mustache

## Usage

    sm.send(email, users, callback)

* `email` is the same object as in the `sendgrid.send(email)` method.
Additionnally, you can specify a template file with `textTemplate` and `htmlTemplate` (instead of using `text` and `html`).
  
* `users` is an array of JSON objects with an `email` property and the other mustache parameters.
  
* `callback` is a `function(success, message, end)` called if 1000 emails have been sent or if all emails have been sent.
The `end` parameter is a boolean indicating if it's the latter.
For example, if we're sending 3500 mails, the callback will be called 3 first times
with `end === false` for the first 3000 emails and one last time with `end === true` for the last 500 emails.

## Example

``` js
  var sm = require('sendgrid-mustache').open({
    user: 'your_api_username',
    key: 'your_api_key'
  });

  sm.send({  
    from: 'your@domain.com',
    subject: 'Hello {{name}}',
    text: 'You are the president of {{country}}'
  }, [
    {email: 'francois@gmail.com', name: 'Francois Hollande', country: 'France'},
    {email: 'barack@yahoo.com', name: 'Barack Obama', country: 'USA'},  
    {email: 'angela@hotmail.com', name: 'Angela Merkel', country: 'Germany'}
  ], function(success, message) {
    console.log(success ? 'Emails sent' : message);
  });
```

## Limitation

Since we use the SendGrid X-SMTPAPI under the hood, this module only supports basic mustache. No sections!


## MIT License 

Copyright (c) 2012 Jie Meng-Gerard <contact@jie.fr>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.