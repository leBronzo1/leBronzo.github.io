function updateLocationOptions() {
    const mod = document.getElementById("event_modality").value;
    const loc = document.getElementById("place");
    const url = document.getElementById("URL");
    const locationInput = document.getElementById("event_location");
    const urlInput = document.getElementById("event_remote_url");

    if(mod === "in-person") {
        loc.style.display = "block";
        url.style.display = "none";
        locationInput.required = true;
        urlInput.required = false;
    } else if (mod === "remote") {
        loc.style.display = "none";
        url.style.display = "block";
        locationInput.required = false;
        urlInput.required = true;
    }
}

function clearEditingState() {
    const form = document.getElementById("event_form");
    delete form.dataset.editingElement;
    delete form.editingElement;
    form.reset();
    updateLocationOptions();
}

function openEditModal(eventDetails, eventElement) {
    document.getElementById("event_name").value = eventDetails.name;
    document.getElementById("event_category").value = eventDetails.category;
    document.getElementById("event_weekday").value = eventDetails.weekday;
    document.getElementById("event_time").value = eventDetails.time;
    document.getElementById("event_modality").value = eventDetails.modality;
    document.getElementById("event_location").value = eventDetails.location;
    document.getElementById("event_remote_url").value = eventDetails.remote_url;
    document.getElementById("event_attendees").value = eventDetails.attendees;
    
    updateLocationOptions();
    
    document.getElementById("event_form").dataset.editingElement = true;
    document.getElementById("event_form").editingElement = eventElement;
    
    const myModalElement = document.getElementById('event_modal');
    const myModal = new bootstrap.Modal(myModalElement);
    myModal.show();
}

function saveEvent(event) {
    if (event) event.preventDefault();
    
    const form = document.getElementById("event_form");
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const eventDetails = {
        name: document.getElementById("event_name").value,
        category: document.getElementById("event_category").value,
        weekday: document.getElementById("event_weekday").value,
        time: document.getElementById("event_time").value,
        modality: document.getElementById("event_modality").value,
        location: document.getElementById("event_location").value,
        remote_url: document.getElementById("event_remote_url").value,
        attendees: document.getElementById("event_attendees").value
    };

    if(eventDetails.modality === "in-person") {
        eventDetails.remote_url = "";
    } else if (eventDetails.modality === "remote") {
        eventDetails.location = "";
    }

    console.log(eventDetails);
    
    if (form.dataset.editingElement === "true") {
        let oldElement = form.editingElement;
        
        let updatedCard = createEventCard(eventDetails);
        
        oldElement.parentNode.replaceChild(updatedCard, oldElement);
        
        delete form.dataset.editingElement;
        delete form.editingElement;
    } else {
        addEventToCalendarUI(eventDetails);
    }

    form.reset();
    
    document.getElementById("place").style.display = "none";
    document.getElementById("URL").style.display = "none";
    
    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();
}


function createEventCard(eventDetails) {
    let event_element = document.createElement('div');
    
    event_element.classList = `event row border rounded m-1 py-1 ${eventDetails.category}`;
    
    let info = document.createElement('div');
    
    let name = eventDetails.name;
    info.innerHTML = `
        <strong>${name}</strong><br>
        Time: ${eventDetails.time}<br>
        Modality: ${eventDetails.modality}<br>
        ${eventDetails.modality === 'in-person' ? `Location: ${eventDetails.location}` : `URL: ${eventDetails.remote_url}`}<br>
        Attendees: ${eventDetails.attendees}
    `;
    
    event_element.appendChild(info);
    
    event_element.addEventListener('click', function() {
        openEditModal(eventDetails, event_element);
    });
    
    event_element.style.cursor = 'pointer';
    
    return event_element;
}

function addEventToCalendarUI(eventInfo) {
    let event_card = createEventCard(eventInfo);
    let day_div = document.getElementById(eventInfo.weekday);
    
    day_div.appendChild(event_card);
}