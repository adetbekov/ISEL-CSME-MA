let checked_inputs = [];
const PROGRESS_INCREMENT = 100 / 30;

function checkOnInit(l) {
	let data = get_data()
	if (data.length % 3 === 1 && l !== "tasks") {
		window.location.href = "tasks.html"
	} else if (data.length % 3 === 2 && l !== "overall_assessment") {
		window.location.href = "overall_assessment.html"
	} else if (data.length % 3 === 0 && l !== "personal_data") {
		window.location.href = "personal_data.html"
	}
}

function checkBrowser(o) {
    let option1 = document.getElementById("first");
    let option2 = document.getElementById("second");
    let option3 = document.getElementById("third");
    if ((o.id.localeCompare("first") !== 0) && (o.value === option1.value)) {
        option1.value = "";
    }
    if ((o.id.localeCompare("second") !== 0) && (o.value === option2.value)) {
        option2.value = "";
    }
    if ((o.id.localeCompare("third") !== 0) && (o.value === option3.value)) {
        option3.value = "";
    }
}

function validate_other_search_engine() {
    let x = document.forms["personaldata"]["other_search_engine"].value;
    if (x === "No") {
        document.forms["personaldata"]["other"].disabled = true;
        document.forms["personaldata"]["other"].value = "";
    } else {
        document.forms["personaldata"]["other"].disabled = false;
    }
}

function allStorage() {
    let values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }

    return values;
}

function validateForm(f) {
	let d = new Date(),
		form_name = f.name,
    	data = get_data(),
    	keys = Object.keys(localStorage);
    if (data.length != 3){
	    localStorage.removeItem(keys[allStorage().length-1]); 
    } else {
    	data = []
    }
	data = update_data(data, form_name);
    localStorage.setItem(d, JSON.stringify(data));
}

function get_data() {
    return JSON.parse((allStorage().length > 0)?allStorage()[0]:null) || []
}

function update_data(data, form_name) {
	let new_data = {}
    let elements = document.forms[form_name]
    for (let i = 0; i < elements.length; i++) {
        let elm = elements[i]
        if ((elm.type === 'radio' && elm.checked || elm.type === 'range')
        || (elm.tagName === 'TEXTAREA' && elm.value !== '')
        || (elm.tagName === 'SELECT')
        || (elm.type === 'text')) {
			new_data[elm.name] = elm.value;
        }
    }
    data.push(new_data)
    return data
}

function check_user_input(name) {
    return !(checked_inputs.indexOf(name) === -1);
}

function increment_progress_bar(event) {
    let target = event.target;
    if (!check_user_input(target.name)) {
        checked_inputs.push(target.name);
        document.getElementById('progress_bar').value += PROGRESS_INCREMENT;
    }
    if (target.tagName === 'TEXTAREA' && target.value === '') {
        checked_inputs.pop(target.name);
        document.getElementById('progress_bar').value -= PROGRESS_INCREMENT;
    }
}

document.getElementById('survey').addEventListener('change', function(event) {
    increment_progress_bar(event);
});