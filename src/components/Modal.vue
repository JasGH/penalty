<template>
  <div>
  </div>
</template>

<script>
import axios from 'axios'
import UserState from "@/js/UserState";

export default {
  name: 'Modal',
  data() {
    return {
      timerCount: 30,
      apiAddresses : {
        // login: document.querySelector('input[name="js-var-loginActionUrl"]').value,
        login: 'login',
        resendVerify: '/mobile/resend',
        verify: '/mobile/verify',
        updateInformation: '/user/profile'
      },
      inputData: {
        firstName: '',
        lastName: '',
        major_id: '',
        grade_id: '',
        nationalCode: '',
        mobile: '',
        updateType: 'profile'
      },
      verificationCode :'',
      dialog: false,
      loading: false,
      loginFormVisibility: false,
      verificationFormVisibility: false,
      completeInformationFormVisibility: false,
      notifications: false
    }
  },
  mounted() {
    UserState.setData({
      data: null,
      hasPurchasedProduct: false,
      isUserInfoComplete: false,
      verified: false
    })
    console.log('UserState', UserState.getData())
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }

      },
      immediate: true
    }
  },
  methods: {
    show () {
      this.setProperForm()
      this.showModal()
    },
    showModal () {
      this.dialog = true
    },
    setLoading(status) {
      this.loading = status
    },
    isUserLogin () {
      return UserState.isLogin
    },
    getUserData () {
      return UserState.getData
    },
    isUserVerified () {
      return UserState.isVerified
    },
    isInformationCompleted () {
      return UserState.isInformationCompleted
    },
    sendDataForLogin() {
      const loginData = {
        mobile: this.inputData.mobile,
        password: this.inputData.nationalCode
      }
      this.sendRequest(loginData, this.loginRequest)
    },
    sendRequest(formData, ajaxMethod) {
      if (!this.validateForm(formData)) {
        return
      }
      // ajaxSetup()
      ajaxMethod(formData)
    },
    loginRequest (userInfo) {
      this.setLoading(true)
      axios.post(this.apiAddresses.login, userInfo)
          .then( response => {
            this.setLoading(false)
            this.onLogedIn(response.data.data)
            this.fillUserDataInForm()
            this.setProperForm()
          })
          .catch( error => {
            this.handelError(error)
            this.setLoading(false)
          })
    },
    handelError(data) {
      let errors = data.responseJSON.errors;
      let error = data.responseJSON.error;
      let message = data.responseJSON.message;
      let status = data.status
      if (status === 422 && errors) {
        if (errors.mobile) {
          errors.mobile.forEach((item, index) => this.showResponseMessage(errors.mobile[index], 'append'))
        }
        if (errors.password) {
          this.showResponseMessage('کد ملی خود را وارد کنید.')
        }
        if (errors.code) {
          errors.code.forEach(item => message.push(item))
        }
        if (errors.first_name) {
          errors.first_name.forEach(item => message.push(item))
        }
        if (errors.last_name) {
          errors.last_name.forEach(item => message.push(item))
        }
        if (errors.major_id) {
          this.showResponseMessage('یک رشته را انتخاب کنید')
        }
        if (errors.grade_id) {
          this.showResponseMessage('یک مقطع را انتخاب کنید')
        }
        if (data.responseJSON.error) {
          this.showResponseMessage(data.responseJSON.error)
        }
      } else if (data.status === 429) {
        this.showResponseMessage('تلاش هایتان زیاد بود.کمی بعد امتحان کنید')
      } else if (error) {
        this.showResponseMessage(error)
      } else if (message) {
        this.showResponseMessage(error)
      } else {
        this.showResponseMessage('خطایی رخ داده است. مجددا تلاش کنید.');
      }
    },
    VerifyRequest () {},
    updateInformationRequest (userData) {
      this.setLoading(true)
      axios.post(this.apiAddresses.updateInformation, userData)
          .then((response) => {
            this.setLoading(false)
            this.showResponseMessage(response.data.data.message, 'replace', 'success')
            this.onReceivedInformationRequest(response.data.data, userData)
            if (!this.isInformationCompleted()) {
              this.showResponseMessage('اطلاعات شما همچنان تکمیل نیست.', 'append', 'warning')
            } else {
              this.onInformationCompleted(response.data.data, userData)
            }
          })
          .catch((e) => {
            this.handelError(e)
          })
    },
    fillUserDataInForm() {
      const userData = this.getUserData()
      if (!userData || !userData.data || !userData.data.info) {
        return
      }

      const userInfo = userData.data

      if (userInfo.firstName) {
        // $('#landingSignUpInputFirstName').val(userInfo.firstName)
        // $('#landingSignUpInputFirstName').prop('disabled', true)
      }
      if (userInfo.lastName) {
        // $('#landingSignUpInputLastName').val(userInfo.lastName)
        // $('#landingSignUpInputLastName').prop('disabled', true)
      }
      if (userInfo.info.grade) {
        // $('#landingSignUpInputGrade').val(userInfo.info.grade.id)
      }
      if (userInfo.info.major) {
        // $('#landingSignUpInputMajor').val(userInfo.info.major.id)
      }
    },
    setProperForm() {
      var showForm = () => {
      }

      if (!this.isUserLogin()) {
        showForm = this.showLoginForm
      } else if (!this.isUserVerified()) {
        showForm = this.showVerifyForm
      } else if (!this.isInformationCompleted()) {
        showForm = this.showCompleteInformationForm
      } else {
        this.hideModal()
      }

      showForm()
    },
    hideModal () {
      this.dialog = false
    },
    showLoginForm () {
      // show login form
      this.hideAllForms()
      this.loginFormVisibility = true
      // $('#landingLoginForm').fadeIn()
    },
    showVerifyForm() {
      this.hideAllForms()
      this.printUserPhoneNumber()
      this.resendVerifyCodeRequest()
      this.verificationFormVisibility= true
      this.onShowVerifyForm()
    },
    printUserPhoneNumber() {
      const userData = this.getUserData()
      if (!userData) {
        return
      }
      this.inputData.mobile = userData.mobile
      // $('.map-step-modal #landingSignUpPhoneNumberTitle').text(userData.mobile)
    },
    pasteVerificationCode (value) {
      this.verificationCode = value
    },
    resendVerifyCodeRequest() {
      this.setLoading(true)
      axios.get(this.apiAddresses.resendVerify)
          .then(response => {
            this.setLoading(false)
            this.onSentVerificationCode(response)
            if (response.data.data.code) {
              this.pasteVerificationCode(response.data.data.code);
            }
          })
          .catch( error => {
            this.handelError(error)
          })
    },
    showCompleteInformationForm() {
      this.hideAllForms()
      this.fillUserDataInForm()
      this.completeInformationFormVisibility= true
    },
    hideAllForms () {
      this.loginFormVisibility = false
      this.verificationFormVisibility = false
      this.completeInformationFormVisibility = false
    },
    validateForm(input) {
      // this.resetResponseMessage()
      let status = true
      let message = []
      if (typeof input === 'object') {
        for (const [key, value] of Object.entries(input)) {
          if (key === "firstName" && !value) {
            status = false
            message.push('نام خود را وارد نکرده اید')
          } else if (key === "lastName" && !value) {
            status = false
            message.push('نام خانوادگی خود را وارد نکرده اید')
          } else if (key === "major" && !value) {
            status = false
            message.push('لطفا رشته خود را انتخاب کنید')
          } else if (key === "grade" && !value) {
            status = false
            message.push('لطفا مقطع خود را انتخاب کنید')
          }
        }
        message.forEach((item, index) => this.showResponseMessage(message[index], 'append'))
      } else {
        if (input.length === 0) {
          status = false
          message = 'لطفا فیلد خواسته شده را پر نمائید';
          this.showResponseMessage(message);
        }
      }
      return status
    },
    showResponseMessage(message, mode, type) {
      if (typeof type === 'undefined') {
        type = 'danger'
      }
      // vuetify notify
      // var template = '<div class="' + type + '">' + message + '</div>'
      // if (mode === 'append') {
      //   $('.map-step-modal .modal-body .modal-response-text').append(template)
      // } else {
      //   $('.map-step-modal .modal-body .modal-response-text').html(template)
      // }
    },
    updateInformation() {
      let data = this.inputData
      data.updateType = 'profile'
      data.mobile = ''
      data.nationalCode = ''
      this.sendRequest(data, this.updateInformationRequest);
    },
    resetResponseMessage() {
      // showResponseMessage('')
    },
    onShowVerifyForm() {

    },
    onSendVerificationCode() {

    },
    onSentVerificationCode() {
      // TimerClass.start()
    },
    onVerified() {
      UserState.setData({verified: true})
    },
    onReceivedInformationRequest(completeInformationResponse) {
      UserState.setData({
        data: completeInformationResponse.user
      })
    },
    onInformationCompleted() {
      const userData = UserState.getData()
      // do what is after modal
      // if (!userData || !userData.hasPurchasedProduct) {
      //
      // }
    },
    onLogedIn(loginResponse) {
      const userDataFromResponse = loginResponse.data.user;
      const verified = (typeof userDataFromResponse.mobile_verified_at !== 'undefined' && userDataFromResponse.mobile_verified_at !== null)
      UserState.setData({
        verified: verified,
        data: userDataFromResponse
      })
    },
    sendVerificationCode () {
      const userData = this.getUserData()
      if (!userData.data || !userData.data.mobile) {
        return
      }
      const data = {
        code: this.getVerificationCodeInput(),
        mobile: userData.data.mobile
      }
      this.sendRequest(data, this.verifyRequest)
      this.onSendVerificationCode()
    },
    getVerificationCodeInput () {
      return this.verificationCode
    },
    verifyRequest(data) {
      this.setLoading(true)
      axios.post(this.apiAddresses.verify, {
        code: data.code,
        mobile: data.mobile
      })
          .then( response => {
            this.setLoading(false)
            this.onVerified(response.data.data)
            this.setProperForm()
          })
          .catch( error => {
            this.handelError(error)
            this.setLoading(false)
          })
    }
  }
}
</script>

<style scoped>

</style>
