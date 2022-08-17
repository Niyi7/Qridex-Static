$(document).ready(() => {

    if (jQuery("nav .scroll a").length) {
        $("nav .scroll a").on('click', function (event) {
            // Make sure this.hash has a value before overriding default behavior
            if (this.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();

                // Store hash
                var hash = this.hash;

                // Using jQuery's animate() method to add smooth page scroll
                // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function () {

                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
                });
            } // End if
        });
    }

    if (jQuery("#utf_register_account_form").length) {
        document.querySelector('#utf_register_account_form').addEventListener('submit', async (e) => {
            e.preventDefault();
            // var data = new FormData(document.utf_register_account_form);
            const fname = document.querySelector('#first-name').value;
            const lname = document.querySelector('#last-name').value;
            const email = document.querySelector('#email-address-register').value;
            const pwd = document.querySelector('#password-register').value;
            const pwdAgain = document.querySelector('#password-repeat-register').value;
            if (pwd == pwdAgain) {
                try {
                    const resp = await fetch('/api/register', {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: { 'Content-Type': 'application/json' },
                        // body: JSON.stringify({ first_name:data.get(""), last_name:data.get(""), email:data.get("email-address-register"), password:data.get("password-register") }),
                        body: JSON.stringify({ first_name: fname, last_name: lname, email: email, password: pwd }),
                    });
                    const json = await resp.json();
                    if (resp.status === 200) {
                        if (json.status === 'success') {
                            // setState(false);
                            window.location.href = `/pending/${json.data}`;
                        } else {
                            VanillaToasts.create({ title: 'Failed', text: json.msg, type: 'error', positionClass: 'bottomRight', timeout: 5000, single: true });
                        }
                    }
                } catch (e) { }
            }
        });
    }

    if (jQuery("#resend-confirmation").length) {
        document.querySelector('#resend-confirmation').addEventListener('click', (e) => {
            try {
                fetch(`/verify/resend/${document.querySelector('#resend-confirmation').getAttribute("data-slug")}`).then(resp => {
                    resp.json().then(json => {
                        if (resp.status === 200 && json.status === 'success') {

                        }
                    });
                });
            } catch (e) { }
        })
    }

    if ($('#login_form').length) {
        document.querySelector('#login_form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.querySelector('#emailaddress').value;
            const password = document.querySelector('#password').value;
            post('/api/login', { email, password });
        });
    }

    if (jQuery("#news-letter-sub-form").length) {
        document.querySelector('#news-letter-sub-form').addEventListener('submit', (e) => {
            e.preventDefault();
            var email = document.getElementById("news-letter-email").value;
            fetch('/api/subscribe/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            })
                .then(resp => resp.json())
                .then(json => {
                    if (json.status === 'success') {
                        $("form#news-letter-sub-form").trigger("reset");
                    }
                }).catch(err => {

                });
        })
    }

    if (jQuery('.add-social-link').length) {
        const BTs = document.getElementsByClassName('add-social-link');
        Array.from(BTs).forEach((el, index) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    // ${el.getAttribute("data-medium")}
                    fetch(`https://qridex.com/api/login/twitter`);
                } catch (e) { }
            });
        });
    }

    window.fbAsyncInit = function () {
        FB.init({ appId: '400083941645483', cookie: true, xfbml: true, version: 'v13.0' });
        // FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/all.js";
        //  js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    if (jQuery("#fb-customer-chat").length) {
        var chatbox = document.getElementById('fb-customer-chat');
        chatbox.setAttribute("page_id", "101473952167677");
        chatbox.setAttribute("attribution", "biz_inbox");
    }

    if (jQuery("#facebook-login").length) {
        // window.fbAsyncInit = function() {
        //     FB.init({appId:'400083941645483', cookie:true, xfbml:true, version:'v13.0'});
        //     // FB.AppEvents.logPageView();
        // };

        // (function(d, s, id){
        //      var js, fjs = d.getElementsByTagName(s)[0];
        //      if (d.getElementById(id)) {return;}
        //      js = d.createElement(s);
        //      js.id = id;
        //      js.src = "https://connect.facebook.net/en_US/all.js";
        //      fjs.parentNode.insertBefore(js, fjs);
        // }(document, 'script', 'facebook-jssdk'));

        $("#facebook-login").on('click', function (event) {

            FB.getLoginStatus(function (response) {
                if (response.status == 'connected') {
                    getFBProfile(response);
                } else {
                    FB.login(getFBProfile, { scope: 'public_profile,email' }); //Facebook Login requires dvanced public_profile permission, to be used by external users.
                }
            });
        });
    }

    if ($('#twitter-login')) {

    }

    if ($('#logout').length) {
        document.querySelector('#logout').addEventListener('click', (e) => {
            e.preventDefault();
            fetch('/api/logout').then(resp => {
                resp.json().then(json => {
                    if (resp.status == 200 && json.status == 'success') {
                        try {
                            FB.logout(function (response) { });
                        } catch (e) { }
                        window.location.reload();
                    }
                });
            });
        });
    }
});

function getFBProfile(response) {
    try {
        if (response.authResponse) {
            FB.api('/me?fields=email,first_name,last_name', function (response) {
                post('/api/login/facebook', response);
            });
        }
    } catch (e) {
        console.log('Facebook login error', e);
    }
}

const post = async (endPoint, fields) => {
    try {
        const resp = await fetch(endPoint, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields) });
        const json = await resp.json();
        if (resp.status === 200) {
            if (json.status === 'success') {
                window.location.reload();
            } else {
                VanillaToasts.create({ title: 'Failed', text: json.msg, type: 'error', positionClass: 'bottomRight', timeout: 5000, single: true });
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function scrollFunction() {
    // console.log('Scrolling');

    //     // let pos = el.getBoundingClientRect();
    //     console.log(document.body.scrollTop, document.documentElement.scrollTop);

    //   if (document.body.scrollTop > top || document.documentElement.scrollTop > top) {
    //     // mybutton.style.display = "block";
    //     // alert('Greater')
    //   } else {
    //     // mybutton.style.display = "none";
    //   }
}

// if (window.innerWidth <= 768) {
//     const heroFilterDropdown = document.querySelector('.utf-intro-search-field-item .bootstrap-select.btn-group .dropdown-menu');
//     heroFilterDropdown.setAttribute('title', '')
// }

document.querySelector('.utf-intro-search-field-item .bootstrap-select.btn-group .dropdown-toggle .filter-option').innerText = 'are you there?'