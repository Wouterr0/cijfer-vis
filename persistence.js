results = {};
// let results = JSON.parse(atob('eyIwb3RnbXRsbm51Ijo2LjQsImlhM241bXBxOGgiOjguOCwiYmlidGhueDFkaiI6Ny4xLCJnYng2aGRxaWhwIjo4LjgsImQ0dno2djViOTkiOjguNiwieDRtbnN1NXBtcyI6OC4zLCI0amduc2g3MjN5Ijo2LjksIjM2NDVnY3gwbjQiOjguMywiNHNmM255a2w1OSI6OS42LCJ0dHptMHpmOW03IjoxMCwiZ3c3cDc2M3U1NSI6OS4yLCJ5d29mbHFrZHh6Ijo3LjksIjh1bG1jMWpxcDciOjguNSwiaGZoeXlyams0MCI6OC43LCJ3M3RmbXphcTBvIjo3LjMsImVqc3hyeHg0N3EiOjguMywiZGF2dmU1NHU0dyI6OS40LCJxdmt3MW16czV5Ijo2LCJ6c3dwcDE5aDl4Ijo3LCJ3bzRtaWgxaGNxIjo2LjMsInl0NW41eHN1eWEiOjYuOCwiN3JkNmYwZ2FhaCI6OC4yfQ=='));

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function load(str) {
    if (!storageAvailable('localStorage')) {
        console.error('localStorage is not accessible');
        return false;
    }
    let saved_results = localStorage.getItem(str);
    if (saved_results === null) {
        return false;
    }
    return JSON.parse(atob(saved_results));
}

function load_results() {
    let res = load('results', results);
    if (res) {
        Object.assign(results, results, res);
    }
}

function load_settings() {
    let res = load('settings', settings);
    if (res) {
        Object.assign(settings, settings, res);
    }
}

function save(str, var_) {
    if (!storageAvailable('localStorage')) {
        console.error('localStorage is not accessible');
        return;
    }
    localStorage.setItem(str, btoa(JSON.stringify(var_)));
    return true;
}

function save_results() {
    save('results', results);
}

function save_settings() {
    save('settings', settings);
}