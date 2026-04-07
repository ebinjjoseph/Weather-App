document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const suggestionsBox = document.getElementById('suggestions-box');
    const errorEl = document.getElementById('error');
    
    const elCity = document.getElementById('city-name');
    const elTemp = document.getElementById('temperature');
    const elCond = document.getElementById('condition');
    const elHumid = document.getElementById('humidity');
    const iconContainer = document.getElementById('icon-slot-container');
    
    const bgLayer1 = document.getElementById('bg-layer-1');
    const bgLayer2 = document.getElementById('bg-layer-2');
    let activeLayer = 1;
    
    // Hardcode your OpenWeatherMap API Key here
    const API_KEY = "62e942ac62b9729945198ba25704325d";

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const iconCodes = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d', '01n', '02n', '03n', '04n', '09n', '10n', '11n', '13n', '50n'];

    function rollIconSlotMachine(container, finalIconCode) {
        container.innerHTML = ''; 
        
        const colContent = document.createElement('span');
        colContent.style.display = 'inline-flex';
        colContent.style.flexDirection = 'column';
        
        // Match the delay timings roughly to the letters
        const duration = 2.5 + Math.random() * 0.6; 
        colContent.style.transition = `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1)`;
        
        const numSpins = 6; 
        let html = '';
        
        for (let i = 0; i < numSpins; i++) {
            const randomCode = iconCodes[Math.floor(Math.random() * iconCodes.length)];
            html += `<img src="https://openweathermap.org/img/wn/${randomCode}@4x.png" style="width:120px;height:120px;display:block;" alt="spin">`;
        }
        html += `<img src="https://openweathermap.org/img/wn/${finalIconCode}@4x.png" style="width:120px;height:120px;display:block;" alt="weather">`;
        
        colContent.innerHTML = html;
        colContent.style.transform = `translateY(0)`; 
        container.appendChild(colContent);
        
        void colContent.offsetWidth; // Force Reflow
        
        requestAnimationFrame(() => {
            colContent.style.transform = `translateY(-${numSpins * 120}px)`; // 120px cascade height per image inside strip
        });
    }

    function setWeatherBackground(conditionMain) {
        let bgImg = '';
        const condition = conditionMain.toLowerCase();
        
        if (condition === 'clear') bgImg = "url('assets/sunny.png')";
        else if (condition === 'clouds' || condition === 'mist' || condition === 'haze' || condition === 'fog') bgImg = "url('assets/cloudy.png')";
        else if (condition === 'rain' || condition === 'drizzle' || condition === 'thunderstorm') bgImg = "url('assets/rainy.png')";
        else if (condition === 'snow') bgImg = "url('assets/snowy.png')";
        
        if (!bgImg) return;
        
        // This is the magical "gradient that makes it not that visible" user requirement
        // It blends an 80% opacity white fade directly on top of the cartoon landscape!
        const blendedBg = `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.9)), ${bgImg}`;
        
        if (activeLayer === 1) {
            bgLayer2.style.background = blendedBg;
            bgLayer2.style.backgroundSize = "cover"; 
            bgLayer2.style.backgroundPosition = "center";
            bgLayer2.style.opacity = '1';
            bgLayer1.style.opacity = '0';
            activeLayer = 2;
        } else {
            bgLayer1.style.background = blendedBg;
            bgLayer1.style.backgroundSize = "cover"; 
            bgLayer1.style.backgroundPosition = "center";
            bgLayer1.style.opacity = '1';
            bgLayer2.style.opacity = '0';
            activeLayer = 1;
        }
    }

    function getRandomChar(targetChar) {
        if (/[0-9]/.test(targetChar)) return digits[Math.floor(Math.random() * digits.length)];
        if (/[a-zA-Z]/.test(targetChar)) return chars[Math.floor(Math.random() * chars.length)];
        return targetChar; // fixed symbols like %, ° stay constant so they don't glitch out
    }

    // The true CSS Slot Machine effect algorithm!
    function rollSlotMachine(element, finalValue) {
        const finalStr = String(finalValue);
        element.innerHTML = ''; // Wipe element
        
        // Give the parent element layout alignment logic
        element.style.display = 'inline-flex';
        element.style.alignItems = 'flex-end'; // Keep diverse chars anchored to bottom baseline
        
        for (let i = 0; i < finalStr.length; i++) {
            const finalChar = finalStr[i];
            
            // Respect spacing!
            if (finalChar === ' ' || finalChar === ',') {
                const space = document.createElement('span');
                space.innerHTML = finalChar === ' ' ? '&nbsp;' : ',';
                element.appendChild(space);
                continue; // don't scramble spaces or commas!
            }
            
            // Container locking the height to a single line item
            const colContainer = document.createElement('span');
            colContainer.style.display = 'inline-block';
            colContainer.style.overflow = 'hidden';
            colContainer.style.height = '1.1em';
            colContainer.style.lineHeight = '1.1em'; 
            colContainer.style.verticalAlign = 'bottom';
            // User requested letter spacing!
            colContainer.style.marginRight = '2px';
            
            // The moving tape!
            const colContent = document.createElement('span');
            colContent.style.display = 'inline-flex';
            colContent.style.flexDirection = 'column';
            
            // Extended the time by roughly 2 seconds
            const duration = 2.5 + Math.random() * 0.6; 
            colContent.style.transition = `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1)`;
            
            let html = '';
            const numSpins = 4; // User requested exactly '5' (4 random + 1 final target = 5 total)
            
            for (let j = 0; j < numSpins; j++) {
                html += `<span style="height: 1.1em; line-height: 1.1em;">${getRandomChar(finalChar)}</span>`;
            }
            html += `<span style="height: 1.1em; line-height: 1.1em;">${finalChar}</span>`;
            
            colContent.innerHTML = html;
            colContent.style.transform = `translateY(0)`; // Display starting top
            
            colContainer.appendChild(colContent);
            element.appendChild(colContainer);
            
            // Trigger browser reflow before updating styles to ensure CSS transition is hooked
            void colContent.offsetWidth; 
            
            // Physically pull the tape downwards smoothly over duration
            requestAnimationFrame(() => {
                colContent.style.transform = `translateY(-${numSpins * 1.1}em)`;
            });
        }
    }

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const city = cityInput.value.trim();
        if (!city) return;

        if (API_KEY === "YOUR_API_KEY_HERE" || !API_KEY) {
            showError("API Key missing in script.js");
            return;
        }

        errorEl.classList.add('hidden');
        iconContainer.innerHTML = '<span style="display: block; width: 120px; height: 120px;"></span>'; // Hide previous image
        suggestionsBox.classList.add('hidden'); // Ensure dropdown vanishes on search!
        
        fetchWeather(city, API_KEY);
    });

    let debounceTimer;

    // Autocomplete Input Listener
    cityInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length < 3) {
            suggestionsBox.classList.add('hidden');
            return;
        }

        debounceTimer = setTimeout(() => {
            fetchSuggestions(query);
        }, 350); 
    });

    // Close autocomplete menu when clicking outside
    document.addEventListener('click', (e) => {
        if(!suggestionsBox.contains(e.target) && e.target !== cityInput) {
            suggestionsBox.classList.add('hidden');
        }
    });

    async function fetchSuggestions(query) {
        if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") return;
        
        try {
            // Using OpenWeatherMap's Geocoding API to resolve predictive state/country searches
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${encodeURIComponent(API_KEY)}`;
            const response = await fetch(url);
            if (!response.ok) return;
            const data = await response.json();
            
            suggestionsBox.innerHTML = '';
            if (data.length === 0) {
                suggestionsBox.classList.add('hidden');
                return;
            }

            data.forEach(place => {
                const li = document.createElement('li');
                const nameSpan = document.createElement('span');
                nameSpan.textContent = place.name;
                
                const detailSpan = document.createElement('span');
                detailSpan.className = 'state-country';
                const stateData = place.state ? `${place.state}, ` : '';
                detailSpan.textContent = `${stateData}${place.country}`;
                
                li.appendChild(nameSpan);
                li.appendChild(detailSpan);
                
                li.addEventListener('click', () => {
                    // Populate input accurately with city, state code, country code structure API expects natively 
                    cityInput.value = `${place.name}, ${place.state ? place.state + ',' : ''}${place.country}`;
                    suggestionsBox.classList.add('hidden');
                    
                    searchForm.dispatchEvent(new Event('submit'));
                });
                suggestionsBox.appendChild(li);
            });
            
            suggestionsBox.classList.remove('hidden');

        } catch (err) {
            console.error("Geocoding Error:", err);
        }
    }

    async function fetchWeather(city, apiKey) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(apiKey)}&units=metric`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 401) throw new Error("Invalid API key.");
                if (response.status === 404) throw new Error(`City "${city}" not found.`);
                throw new Error("API Fetch Error");
            }

            const data = await response.json();
            displayWeather(data);

        } catch (err) {
            rollSlotMachine(elCity, "Error");
            rollSlotMachine(elTemp, "0");
            rollIconSlotMachine(iconContainer, "50d"); // Provide mist/haze code placeholder on error
            rollSlotMachine(elCond, "not found");
            rollSlotMachine(elHumid, "0%");
            showError(err.message);
        }
    }

    function displayWeather(data) {
        errorEl.classList.add('hidden');
        
        const cityName = `${data.name}, ${data.sys.country}`.toUpperCase();
        const temp = Math.round(data.main.temp);
        const weatherCondition = data.weather[0];
        const conditionDesc = weatherCondition.description;
        const humidity = `${data.main.humidity}%`;
        const conditionMain = weatherCondition.main; 

        // Set the background gracefully!
        setWeatherBackground(conditionMain);

        // Hit the machine!
        rollSlotMachine(elCity, cityName);
        rollSlotMachine(elTemp, temp);
        rollSlotMachine(elCond, conditionDesc);
        rollSlotMachine(elHumid, humidity);
        
        const iconCode = weatherCondition.icon;
        rollIconSlotMachine(iconContainer, iconCode);
    }

    function showError(message) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }

});
