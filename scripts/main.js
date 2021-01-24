// fetch("./data/EntryData.json")
//   .then(response => response.json())
//   .then(EntryData = JSON.parse(response));
// EntryData = JSON.parse(EntryData)


// Load data from GitHub API
fetch(`https://raw.githubusercontent.com/JiangJY-713/AL_Index/main/data/entry_info.json`)
  .then(function(response) {
    if (response.ok) {
        response.json().then(function(json){
            entry_info = [{}];
            for (var i = 0; i < json.length; i++) {
                entry_info[i] = unpackEntry(json[i]);
            }
            const calendar = new Calendar('#calendar', {
                startYear: 1817,
                style: 'background',
                minDate: new Date(1817,4, 21),
                maxDate: new Date(1840,7,13),
                enableContextMenu: true,
                enableRangeSelection: true,
                contextMenuItems:[
                    {
                        text: 'Update',
                        click: editEvent
                    },
                    {
                        text: 'Delete',
                        click: deleteEvent
                    }
                ],
                selectRange: function(e) {
                    editEvent({ startDate: e.startDate, endDate: e.endDate });
                },
                mouseOnDay: function(e) {
                    if(e.events.length > 0) {
                        var content = '';
                        
                        for(var i in e.events) {
                            content += '<div class="event-tooltip-content">'
                                            + '<div  class="WYAS" >' + 'WYAS Link: ' +'<a href='+e.events[i].wyasLink+' target="popsite" id="externallink">Journal</a>'  + '<p></p></div>'
                                            // + '<div class="event-location">' + e.events[i].location + '</div>'
                                        + '</div>';
                            // var $link=$(content).find('.linkspan');            

                        }            
            

                        $(e.element).popover({ 
                            trigger: 'manual',
                            container: 'body',
                            html:true,
                            content: content,
                            // delay:{show:500, hide:1000},
                            container: $(e.element)
                        });
                        
                        $(e.element).popover('show');
                        // e.popover.stopPropagation();
                    }
                },            

                mouseOutDay: function(e) {
                    if(e.events.length > 0) {
                        $(e.element).popover('hide');
                    }
                },
                dayContextMenu: function(e) {
                    $(e.element).popover('hide');
                },
                dataSource:  entry_info
            });
        document.querySelector('#update-current-year').addEventListener('click', function() {
            calendar.setYear(document.querySelector('#current-year').value);
        });
        })
    }else{
        console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });



function editEvent(event) {
    $('#event-modal input[name="event-index"]').val(event ? event.id : '');
    $('#event-modal input[name="event-name"]').val(event ? event.name : '');
    $('#event-modal input[name="event-location"]').val(event ? event.location : '');
    $('#event-modal input[name="event-start-date"]').datepicker('update', event ? event.startDate : '');
    $('#event-modal input[name="event-end-date"]').datepicker('update', event ? event.endDate : '');
    $('#event-modal').modal();
}

function deleteEvent(event) {
    var dataSource = calendar.getDataSource();
    
    calendar.setDataSource(dataSource.filter(item => item.id == event.id));
}

function saveEvent() {
    var event = {
        id: $('#event-modal input[name="event-index"]').val(),
        name: $('#event-modal input[name="event-name"]').val(),
        location: $('#event-modal input[name="event-location"]').val(),
        startDate: $('#event-modal input[name="event-start-date"]').datepicker('getDate'),
        endDate: $('#event-modal input[name="event-end-date"]').datepicker('getDate')
    }
    
    var dataSource = calendar.getDataSource();

    if (event.id) {
        for (var i in dataSource) {
            if (dataSource[i].id == event.id) {
                dataSource[i].name = event.name;
                dataSource[i].location = event.location;
                dataSource[i].startDate = event.startDate;
                dataSource[i].endDate = event.endDate;
            }
        }
    }
    else
    {
        var newId = 0;
        for(var i in dataSource) {
            if(dataSource[i].id > newId) {
                newId = dataSource[i].id;
            }
        }
        
        newId++;
        event.id = newId;
    
        dataSource.push(event);
    }
    
    calendar.setDataSource(dataSource);
    $('#event-modal').modal('hide');
}

// document.getElementById('externallink').addEventListener('click',function(e){e.stopPropagation()},false);



$(function() {
    $("#externallink").click(function(event) {
        event.stopPropagation();
    });
});

$(function() {
    $("#externallink").contextmenu(function(event) {
        event.stopPropagation();
    });
});

// $(function() {
//     $("#update-current-year").onclick(function(event) {
//         calendar.setYear(document.querySelector('#current-year').value);
//     });
// });

function unpackEntry(entry_info){
    return ({
        startDate:new Date(entry_info.id),
        endDate: new Date(entry_info.id),
        wyasLink: entry_info.wyasLink
    })
}