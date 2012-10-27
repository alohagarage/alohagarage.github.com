$(document).ready(function() {
    $.getJSON('/settings', function(data) {
        $('#hostname-id').text(data['hostname']);
        $('#port-id').text(data['port']);
        $('#hostname').val(data['hostname']);
        $('#port').val(data['port']);
    });
    var queryStart = 'Enter your query here';
    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('qform'), 
        {lineNumbers: true,
        matchBrackets: true,
        mode: 'javascript',
        });
//<span class="leaf">Leaf1</span>
    myCodeMirror.setValue(queryStart);
    myCodeMirror.focus();
    myCodeMirror.setCursor(0,queryStart.length);

    function getKeys(obj) {
        var keys = [];
        for(var key in obj) {
            keys.push(key);
        }
        return keys
    }


    function loadStatus(data, tableId) {
        var statusMessage = data['status'];
        var query = JSON.stringify(data['q']);
        var tableParent = $(tableId).parent();
        var ogColor = $(tableParent).find('h2').css('color');
        var statusHeader = $(tableParent).find('h2');
        //var ogColor = 'black';
        $(tableParent).find('h2').text('Status: ' + statusMessage);
        if (statusMessage == 'error') {
            if ($(statusHeader).hasClass('statusError')) {
                } else {
                $(statusHeader).toggleClass('statusError')
            }
        } else {
            //$(tableParent).find('h2').text('Status: ' + statusMessage);
            if ($(statusHeader).hasClass('statusError')) {
                $(statusHeader).toggleClass('statusError')
                } else {
            }
        };
        $(tableParent).find('h3').text('Query: ');
        $(tableParent).find('pre').text(query);
        var timerObj = data['timer'];
        var keyList = getKeys(timerObj);
        var tableList = [];
        $.each(keyList, function(i, val) {
            tableList.push('<tr><td>' + val + '</td><td>' + timerObj[val].time + '</td></tr>');
        });
        $(tableId + ' tbody').html(tableList.join(''));
    }

    $('#undo-button').click(function() {
        myCodeMirror.undo();
        return false
    });

    $('#redo-button').click(function() {
        myCodeMirror.redo();
        return false
    });

    $('#clear-button').click(function() {
        myCodeMirror.setValue('');
        return false
    });

    $('#query-form').submit(function() {
        var object_type = $('button[name = "object-type"]').val();
        var verb = $('button[name = "verb"]').val();
        var queryText = myCodeMirror.getValue();
        queryText = queryText.replace(/(\r\n|\n|\r)/gm, '');
        $.post('/query', {
            'query': queryText, 
            'object_type': object_type, 
            'verb': verb
            }, 
            function(data) {
            $('#text').html('<div style="width: 1000px">\
                            <pre>'+ JSON.stringify(data, null, 4) + '</pre\
                            </div>');
            loadStatus(data, '#status-table');
        }, "json");
        return false
    });

    $('#settings-form').submit(function() {
        var hostname = $('#hostname').val();
        var port = $('#port').val();
        if (hostname.length > 0 && port.length) {
            $.post('/settings', { 
                'hostname': hostname, 
                'port': port 
                }, 
                function(data) {
                    $('#hostname').attr('placeholder', data['hostname']);
                    $('#hostname-id').text(data['hostname']);
                    $('#port').attr('placeholder', data['port']);
                    $('#port-id').text(data['port']);
                }, 'json');
            $('#settings-dropdown').toggleClass('open');

            } else {
            alert('You have to enter something for the Hostname and Port');
        };
        return false
    });

    $('#query-cleanup').click(function() {
        // This doesn't work yet.
        var range = { 
                    from: myCodeMirror.getCursor(true),
                    to: myCodeMirror.getCursor(false)
                    };
        myCodeMirror.autoIndentRange(range.from, range.to);
        return false
    });

    $('#examples').popover({ 
        content: '<ul class="nav nav-tabs nav-stacked">\
            <li id="example-1" onClick="javascript: loadExample1()"><a href="#">All Standards in Math Domain 4.NF</a></li><li id="example-2" onClick="javascript: loadExample2()"><a href="#">All ELA Domains</a></li></ul>',
        placement: 'top',
        html: 'true',
        trigger: 'manual',
        title: 'Examples',
    });

    $('#examples').click(function() {
        $('#examples').popover('toggle');
        return false
    });

    $('#hostname-id').click(function() {
        //$('#settings-dropdown').toggleClass('open')
    });
});
