/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    
    var actmonth = new Date();
    var year = actmonth.getFullYear();
    var month = actmonth.getMonth();
    
    $("#mymonth").text(year + "-" + (month+1));
 
        $("#next_month").click(function(){
        actmonth.addMonths(1);
        var year = actmonth.getFullYear();
        var month = actmonth.getMonth();
        $("#mymonth").text(year + "-" + (month+1));
        printCalendar(actmonth);

    });
    
    $("#mymonth").text(year + "-" + (month+1));

    $("#prev_month").click(function(){
    actmonth.addMonths(-1);
    var year = actmonth.getFullYear();
    var month = actmonth.getMonth();
    $("#mymonth").text(year + "-" + (month+1));
    printCalendar(actmonth);
    });
    
    function printCalendar(date){
        $("#calendar").empty();
                        $.ajax({
			type: 'GET',
			url: "http://127.0.0.1:9090/tlog-backend/timelogger/workmonths/" + actmonth.getFullYear().toString() + "/" + (actmonth.getMonth() + 1).toString(),
			contentType: "application/json",
			dataType: 'jsonp',
			traditional: true,
			success: function (json) {
            
            }
    
            });
        var weekcounter = 0;
        var tr = '<tr>';
        $("#calendar").css("width","100%");
        $('<tr><th class = "th">Mon</th><th class = "th">Tue</th><th class = "th">Wed</th><th class = "th">Thu</th><th class = "th">Fri</th><th class = "th">Sat</th><th class = "th">Sun</th></tr>').appendTo('#calendar');
        var firstDay = new Date(date.getFullYear(),date.getMonth(),0).getDay();
        if(firstDay<7)
        {
        for(var i=0;i<firstDay;i++)
        {
            tr += '<td class="td"></td>';
            weekcounter++;
        }
        }

                var wd =false;
            
            
            
                  
        for(var i=0;i<date.getDaysInMonth(date);i++)
        {
            
            
            tr+= '<td>'+(i+1);
                       
            tr+='</td>';
            weekcounter++;
            if(weekcounter === 7)
            {
                
              tr+= '</tr>';
              $(tr).appendTo('#calendar');
              tr = '<tr>';
              weekcounter = 0;
            }

        }
        if(weekcounter !== 0)
        {
        for(var i = weekcounter;i<7;i++)
        {
            
            
            tr += '<td class="td"></td>';
        }
        
        $(tr).appendTo('#calendar');

            }
   
       
       
    
    }
            
   
    printCalendar(actmonth);
    });
