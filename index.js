const api_url = 'https://jsonblob.com/api/jsonBlob/c9978adc-1701-11eb-9634-15fe62b70cf8';

// Get rules from jsonblob API
let rules = '';
fetch(api_url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => {
        for (let rule of data.rules) {
            $(`<li class="list-group-item list-group-item-dark">
            <p>${rule}</p>
            <span class="badge badge-pill badge-danger">X</span>
            </li>`)
                .insertBefore($('#color-rules > div'));
        }

        attachEvents();
    })
    .catch((err) => {
        console.error('Error getting rules', err);
    });

$(document).ready(function () {
    $('#new-color-rule').on('keypress', function (e) {
        if (e.which == 13) {
            addRule();
        }
        attachEvents();
    });

    $('#btn-add').click(function () {
        addRule();
        attachEvents();
    });

    attachEvents();

    $('#btn-random').click(function () {
        randomize();
    });
});

function addRule() {
    const newRule = $('#new-color-rule').val().trim();
    if (!newRule) return;

    // Clear input
    $('#new-color-rule').val('');

    //Add list item
    $(`<li class="list-group-item list-group-item-dark">
    <p>${newRule}</p>
    <span class="badge badge-pill badge-danger">X</span>
    </li>`)
        .insertBefore($('#color-rules > div'));

    updateRules();
}

function attachEvents() {
    $('li').hover(
        function () {
            $(this).find('span').show();
        }, function () {
            $(this).find('span').hide();
        }
    );

    $('.badge').click(function () {
        $(this).parent().hide(400, function () {
            $(this).remove();
            updateRules();
        });
    });
}

function randomize() {
    $('li:not(.list-head)').css('color', '#1b1e21');
    $('li:not(.list-head)').css('backgroundColor', '#c6c8ca');

    let ruleCount = $('ul li').length - 1;

    if (ruleCount < 1) {
        alert('Add some rules first!');
        return;
    }

    let randomPick = Math.floor(Math.random() * ruleCount + 2);

    var rules = [];
    for (i = 2; i <= ruleCount + 1; i++) {
        rules.push(i);
    }

    var interval = 150; // how much time should the delay between two iterations be (in milliseconds)?
    rules.forEach(function (el, index) {
        setTimeout(function () {
            const element = $(`ul li:nth-child(${el})`);
            $(element).animate({
                fontSize: "1.2rem",
            }, 100, function () {
                $(element).animate({
                    fontSize: "1rem",
                }, 100, function () {
                    if (index == rules.length - 1) {
                        $(`ul li:nth-child(${randomPick})`).css('color', 'white');
                        $(`ul li:nth-child(${randomPick})`).css('backgroundColor', 'red');
                    }
                });
            });
        }, index * interval);
    });
}

function updateRules() {
    // Get current rules
    let rules = $('ul li:not(.list-head) p').map(function () { return $(this).text() }).get()

    // Updates rules in jsonblob.com
    fetch(api_url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            rules: rules
        })
    })
        .then(response => {
            console.log(response);
        })
        .catch((err) => {
            console.error('Error sending rule', err);
        });
}