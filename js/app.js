// localStorage persistence
var STORAGE_KEY = 'appointments-vuejs-2.0'
var appointmentsStorage = {
  fetch: function () {
    var appointments = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (appointments.length === 0) {
       appointments = [ 
            {
                description: 'Appointment to get hair done.',
                apptDate: 'July 3 2018',
                apptTime: '12:00'
            },
            {
                description: 'Dr Stover appointment',
                apptDate: 'July 11 2018',
                apptTime: '14:30'
            },
            {
                description: 'Another appointment',
                apptDate: 'July 21 2018',
                apptTime: '09:00'
            }]
    }  
    appointments.forEach(function (appointment, index) {
      appointment.id = index;
    });
    appointmentsStorage.uid = appointments.length
    return appointments
  },
  save: function (appointments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
  }
}

const app = new Vue({
    el: '.appointmentDiv',
    data:  {
            btnState: true,
            showAlert: false,
            validationMsg: '',
            appointments: appointmentsStorage.fetch(),
            newAppointment: {
                id: '',
                description: '',
                apptDate: '',
                apptTime: ''
            },
            alertObj: {
                alert: true,
                alertText: true
            },
            visibility: 'all',
            search: '',
            showForm: false,
            currentDate: new Date()
    },

  // watch appointments change for localStorage persistence
  watch: {
    appointments: {
      handler: function (appointments) {
         console.log('saved watch');
        appointmentsStorage.save(appointments)
      },
      deep: true
    }
  },
    
  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredAppointments: function () {
      return this.appointments.filter((appointment) => {
          return appointment.description.toUpperCase().match(this.search.toUpperCase())
      });
    }
  },   
    
 filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },    
  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
   methods: {
    toggleForm: function() {
        if (this.showForm){
            this.showForm = false;
            this.showAlert = false;
            this.validationMsg = '';
            this.newAppointment = {
                id: '',
                description: '',
                apptDate: '',
                apptTime: ''
            }
        } else
            {
                this.showForm = true; 
            }
    }, 
    addAppointment: function () {
      var value = this.newAppointment;
      this.newAppointment.id = appointmentsStorage.uid++;
      console.log(this.newAppointment);
              
      if (!value.apptDate) {
        this.validationMsg = "Please enter a date greater than today's";
        this.showAlert = true;
        return;
      } 
      if (value.apptDate) {
        this.showAlert = false;
        this.validationMsg = '';
        var enteredDate = new Date(value.apptDate);
        if (enteredDate < this.currentDate) {
        this.validationMsg = "Please enter a date greater than today's";
        this.showAlert = true;
        return;   
        }   
      }       
      if (!value.apptTime) {
        this.showAlert = false;
        this.validationMsg = 'Please enter a time with AM/PM included';
        this.showAlert = true;
        return;
      }
      if (value.description.length < 5) {
        this.showAlert = false;
        this.validationMsg = 'Please enter a description longer than 5 characters';
        this.showAlert = true;
        return
      }    
        
      this.appointments.push(this.newAppointment);
        this.validationMsg = '';
        this.showAlert = false; 
        this.showForm = false;
      this.newAppointment = {
                id: '',
                description: '',
                apptDate: '',
                apptTime: ''
        }
    },

    removeAppt: function (appointment) {
      this.appointments.splice(this.appointments.indexOf(appointment), 1)
    },

    editAppointment: function (appointment) {
      this.beforeEditCache = appointment.description
      this.editedAppointment= appointment
    },

    doneEdit: function (appointment) {
      if (!this.editedAppointment) {
        return
      }
      this.editedAppointment = null
      appointment.description = appointment.description.trim()
      if (!appointment.description) {
        this.removeAppointment(appointment)
      }
    },

    cancelEdit: function (appointment) {
      this.editedAppointment = null
      appointment.description = this.beforeEditCache
    },

    removeCompleted: function () {
      this.appointments = filters.active(this.appointments)
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'appointment-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
});