class RatingWidget extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = "";
        
        // <form action="https://httpbin.org/post" method="POST">
        this.jsForm = document.createElement('form');
        this.jsForm.action = 'https://httpbin.org/post';
        this.jsForm.method = 'POST';

        // <input type="hidden" name="question" value="How satisfied are you?">
        this.question = document.createElement('input');
        this.question.setAttribute("type", "hidden");
        this.question.name = 'question';
        this.question.value = 'How satisfied are you?';

        // <input type="hidden" name="sentBy" value="HTML">
        this.sentby = document.createElement('input');
        this.sentby.setAttribute("type", "hidden");
        this.sentby.name = 'sentBy';
        this.sentby.value = "JS";

        // <input type="number" name="rating" id="rating" min="1" max="5" value="0" required>
        this.rating = document.createElement('input');
        this.rating.setAttribute("type", "hidden");
        this.rating.name = 'rating';
        this.rating.value = '';

        // <div class="stars">
        this.stars = document.createElement('div');
        this.stars.classList.add('stars');

        // 5 <span class="star">&#9733;</span>
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.id = i+1;
            star.classList.add('star');
            star.innerHTML = '&#9733;';
            this.addStarClickEvent(star, i);
            this.stars.appendChild(star);
        };

        // <output class="rating-output" type="hidden" for="rating"></output>
        this.output = document.createElement('output');
        this.output.classList.add('rating-output');
        this.output.setAttribute("type", "hidden");
        this.output.htmlFor = 'rating';
        
        this.jsForm.appendChild(this.question);
        this.jsForm.appendChild(this.rating);
        this.jsForm.appendChild(this.sentby);
        this.jsForm.appendChild(this.stars);
        this.jsForm.appendChild(this.output);

        this.appendChild(this.jsForm);
    }

    addStarClickEvent(star, index) {
        star.addEventListener('click', (event) => {
            event.preventDefault();
            const rating_value = 5-index;
            this.rating.value = rating_value;
            if (rating_value > 3) {
                this.output.value = `Thanks for ${rating_value} star rating!`;
            } else {
                this.output.value = `Thanks for your feedback of ${rating_value} stars. We'll try to do better!`;
            }
            this.stars.style.display = 'none';

            let newForm = new FormData(this.jsForm);
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://httpbin.org/post", true);
            xhr.setRequestHeader("X-Sent-By", "JS");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log(xhr.responseText);
                }
            };
            xhr.send(newForm);
        });
    }
}

customElements.define("rating-widget", RatingWidget);






// weather
class WeatherWidget extends HTMLElement {
    constructor () {
        super();
        this.innerHTML = "";
        // this.url = "https://api.weather.gov/points/32.8801,-117.2340";
        // fetch(this.url).then((response) => response.json())
        // .then((data) => {
        //     console.log(data.properties.forecast);
        // });

        this.url = "https://api.weather.gov/gridpoints/SGX/55,22/forecast"
        fetch(this.url).then((response) => response.json())
        .then((data) => {
            console.log(data);
            const current_weather = data.properties.periods[0];
            const temp = current_weather.temperature;
            const unit = current_weather.temperatureUnit;
            const humid = current_weather.relativeHumidity.value;
            const time = (current_weather.isDaytime == true)? "Day Time":"Night Time";
            const dew_temp = current_weather.dewpoint.value;

            const forcast = document.createElement("p");
            forcast.innerHTML = current_weather.detailedForecast;

            const humidity = document.createElement("p");
            humidity.innerHTML = `Humidity: ${humid}%`

            const timeOfDay = document.createElement("p");
            timeOfDay.innerHTML = `Period: ${time}` 

            const dewPoint = document.createElement("p");
            dewPoint.innerHTML = `Dew Point: ${dew_temp} ${current_weather.dewpoint.unitCode.slice(8)}`

            const weather_icon = document.createElement('img');
            weather_icon.src = current_weather.icon;
            
            this.appendChild(weather_icon);
            this.appendChild(timeOfDay);
            this.appendChild(humidity);
            this.appendChild(dewPoint);
            this.appendChild(forcast);

        });
    }
}

customElements.define("weather-widget", WeatherWidget);

