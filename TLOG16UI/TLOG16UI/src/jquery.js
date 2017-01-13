/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {

    var actmonth = new Date();
    var year = actmonth.getFullYear();
    var month = actmonth.getMonth();
    $("#mymonth").text(year + "-" + (month + 1));

    $(document).on("click", ".addday", function () {
        var id = $(this).attr("id");
        splitid = id.split("-");
        idyear = splitid[0];
        idmonth = splitid[1];
        idday = splitid[2];
        iddate = new Date(idyear, idmonth, idday);
        if (iddate.getDay() === 2 || iddate.getDay() === 3)
        {
            var satsun;
            if (iddate.getDay() === 2)
                satsun = "Saturday";
            if (iddate.getDay() === 3)
                satsun = "Sunday";
            var r = confirm("Are you sure you want to work on " + satsun + "?","");
            if (r)
            {
                req = prompt("Please give me the required working hours in minutes", "450");
                if (req !== null)
                {
                    var workday = {
                        year: idyear,
                        month: idmonth,
                        day: idday,
                        requiredHours: req
                    };
                    $.ajax({
                        url: "http://127.0.0.1:9090/tlog-backend/timelogger/workmonths/workdays/weekend",
                        type: "POST",
                        contentType: "application/json",
                        dataType: 'json',
                        data: JSON.stringify(workday)
                    });
                    printCalendar(actmonth);
                }
            }
        } else
        {
            req = prompt("Please give me the required working hours in minutes", "450");
            if (req !== null)
            {
                var workday = {
                    year: idyear,
                    month: idmonth,
                    day: idday,
                    requiredHours: req
                };
                $.ajax({
                    url: "http://127.0.0.1:9090/tlog-backend/timelogger/workmonths/workdays",
                    type: "POST",
                    contentType: "application/json",
                    dataType: 'json',
                    data: JSON.stringify(workday)
                });
                printCalendar(actmonth);
            }
        }
    });

    function printCalendar(date) {

        $("#calendar").empty();
        var weekcounter = 0;
        var tr = '<tr>';
        $("#calendar").css("width", "100%");
        $('<tr><th class = "th">Mon</th><th class = "th">Tue</th><th class = "th">Wed</th><th class = "th">Thu</th><th class = "th">Fri</th><th class = "th">Sat</th><th class = "th">Sun</th></tr>').appendTo('#calendar');
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 0).getDay();
        if (firstDay < 7)
        {
            for (var i = 0; i < firstDay; i++)
            {
                tr += '<td class="td"></td>';
                weekcounter++;
            }
        }
        $.getJSON("http://127.0.0.1:9090/tlog-backend/timelogger/workmonths", function (data) {
            var extra = 0;
            var sum;
            for (var d = 0; d < data.length; d++)
            {
                if (data[d].date.year === actmonth.getFullYear() && data[d].date.monthValue === (actmonth.getMonth() + 1))
                {
                    extra = parseInt(data[d].extraMinPerMonth);
                    sum = data[d].sumPerMonth;
                }
            }
            $("#sumup").empty();
            if (extra < 0)
            {
                $("#sumup").append("<font color = red> Extra minutes: " + extra + "</font><br>Sum of minutes: " + sum);
            } else
            {
                $("#sumup").append("<font color = blue> Extra minutes: " + extra + "</font><br>Sum of minutes: " + sum);
            }
        });
        console.log("Loading json...");
        $.getJSON("http://127.0.0.1:9090/tlog-backend/timelogger/workmonths/" + actmonth.getFullYear().toString() + "/" + (actmonth.getMonth() + 1).toString(), function (data) {
            var wd;
            var json = JSON.stringify(data);
            console.log("json: " + json.toString());
            console.log("http://127.0.0.1:9090/tlog-backend/timelogger/workmonths/" + actmonth.getFullYear().toString() + "/" + (actmonth.getMonth() + 1).toString());


            for (var i = 0; i < date.getDaysInMonth(date); i++)
            {
                var dayextra = 0;
                wd = false;

                for (var j = 0; j < data.length; j++)
                {
                    var jday = data[j].actualDay.dayOfMonth;
                    if (jday === (i + 1))
                    {
                        wd = true;


                        if (data[j].extraMinPerDay < 0)
                        {
                            dayextra = '<font color = red><center>Extra minutes: ' + data[j].extraMinPerDay + '</font>';

                        } else
                        {
                            dayextra = '<font color = blue><center>Extra minutes: ' + data[j].extraMinPerDay + '</font>';
                        }
                    }
                }
                if (!wd)
                {
                    tr += '<td>' + (i + 1);
                    var thisday = new Date(actmonth.getFullYear(), actmonth.getMonth(), (i + 1));
                    if (thisday <= Date.today())
                    {
                        tr += '<br><center><button type="button" class="btn btn-default btn-lg addday" id="' + actmonth.getFullYear().toString() + "-" + (actmonth.getMonth() + 1).toString() + "-" + (i + 1) + '" aria-label="Left Align"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></center>';
                    }
                } else {
                    tr += '<td class = "workday">' + (i + 1);

                    tr += dayextra + '<br><center><button type="button" id="next_month" class="btn btn-default btn-lg" aria-label="Left Align"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></center>' + '</center>';

                }

                tr += '</td>';
                weekcounter++;
                if (weekcounter === 7)
                {

                    tr += '</tr><tr>';
                    weekcounter = 0;
                }


            }
            if (weekcounter !== 0)
            {
                for (var i = weekcounter; i < 7; i++)
                {
                    tr += '<td class="td"></td>';
                }
                tr += '</tr>';
            }
            $(tr).appendTo('#calendar');
            console.log("Finished printing!");
        });


    }
    printCalendar(actmonth);
    $("#next_month").click(function () {
        actmonth.addMonths(1);
        var year = actmonth.getFullYear();
        var month = actmonth.getMonth();
        $("#mymonth").text(year + "-" + (month + 1));
        printCalendar(actmonth);
    });
    $("#mymonth").text(year + "-" + (month + 1));
    $("#prev_month").click(function () {
        actmonth.addMonths(-1);
        var year = actmonth.getFullYear();
        var month = actmonth.getMonth();
        $("#mymonth").text(year + "-" + (month + 1));
        printCalendar(actmonth);
    });


});