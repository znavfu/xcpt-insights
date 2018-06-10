var template = function(id) {
    var source = document.getElementById(id).innerHTML;
    return Handlebars.compile(source);
};

var API = {
    URL: 'http://localhost:1237/',
    ENDPOINTS: {
        GET_FEEDBACK: 'insights/'
    },

    getFeedback: function(platform, package, callback) {
        $.get(API.URL + API.ENDPOINTS.GET_FEEDBACK + platform + '/' + package + '/', function(data) {
            callback(JSON.parse(data));
        });
    }
};

DATA_POINTS = [
    ['Exception', 'Frequency']
];

var showData = function(platform, package) {
    API.getFeedback(platform, package, function(data) {
        var exceptionsHtml = template('exceptions-list-template')(data.data.exceptions);
        $('.exceptions-list').html(exceptionsHtml);

        $('.ui.accordion').accordion();

        DATA_POINTS = [
            ['Exception', 'Frequency']
        ];
        for (var item in data.data.exceptions) {
            var exception = data.data.exceptions[item];

            DATA_POINTS.push([exception.feedback.exception, parseInt(exception.times)]);

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(DATA_POINTS);

                var options = {
                    title: '',
                    pieHole: 0.4,
                    slices: {
                        0: { color: '#1abc9c' },
                        1: { color: '#2980b9' },
                        2: { color: '#e74c3c' },
                        3: { color: '#2ecc71' },
                        4: { color: '#8e44ad' },
                        5: { color: '#2c3e50' },
                        6: { color: '#9b59b6' }
                    }
                };

                var chart = new google.visualization.PieChart(document.getElementById('exception-breakdown'));

                chart.draw(data, options);
            }
        }
    });
}

$(document).ready(function() {

    $(document).on('click', '.package-list>.item', function(e) {
        var package = $(this).children('.header').eq(0).html();
        var platform = $(this).children('p').eq(0).html();

        $('.package-list>.item.active').removeClass('active');
        $(this).addClass('active');

        showData(platform, package);
    });

    $('.package-list>.item.active').eq(0).click();
});
