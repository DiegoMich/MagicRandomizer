// Initialize ID
let rule_id = localStorage.getItem("next_id") != null ? localStorage.getItem("next_id") : 1;

// Load rules from local storage
for (var i = 0, len = localStorage.length; i < len; ++i) {
    const key = localStorage.key(i);
    if (key == 'next_id') continue;

    const rule = localStorage.getItem(key);

    //Add list item
    $(`<li id='${key}' class="list-group-item list-group-item-dark">
        ${rule}
        <span class="badge badge-pill badge-danger">X</span>
    </li>`).insertBefore($('#color-rules input'));
}


$(document).ready(function () {
    $('#new-color-rule').on('keypress', function (e) {
        if (e.which == 13) {
            addRule();
        }
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

    //Add list item
    $(`<li id='${rule_id}' class="list-group-item list-group-item-dark">
            ${newRule}
            <span class="badge badge-pill badge-danger">X</span>
        </li>
    `).insertBefore($('#color-rules input'));

    //Clear input
    $('#new-color-rule').val('');

    localStorage.setItem(rule_id, newRule);
    rule_id++;
    localStorage.setItem("next_id", rule_id);
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
            localStorage.removeItem($(this).attr('id'));
            $(this).remove();
        });
    });
}

function randomize() {
    $('li:not(.list-head)').css('color','#1b1e21');
    $('li:not(.list-head)').css('backgroundColor','#c6c8ca');
    
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
                    if (index == rules.length-1) {
                        $(`ul li:nth-child(${randomPick})`).css('color','white');
                        $(`ul li:nth-child(${randomPick})`).css('backgroundColor','red');
                    }
                });
            });
        }, index * interval);
    });
}