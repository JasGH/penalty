var UserState = function () {
    var userCurrentState = {
        data: null,
        verified: false,
        hasPurchasedProduct: false
    }

    function setVerified(status) {
        if (typeof status === 'undefined') {
            status = true
        }
        userCurrentState.userVerification = status
    }

    function setHasPurchasedProduct(status) {
        if (typeof status === 'undefined') {
            status = true
        }
        userCurrentState.hasPurchasedProduct = status
    }

    function setData(dataObj) {
        Object.assign(userCurrentState, dataObj)
    }

    function getData() {
        return userCurrentState
    }

    function isLogin() {
        return userCurrentState.data !== null
    }

    function hasUserInformation() {
        return !!userCurrentState.data
    }

    function isInformationCompleted() {
        if (!hasUserInformation()) {
            return false
        }

        if (!userCurrentState.data.info) {
            return false
        }

        return userCurrentState.data.firstName &&
            userCurrentState.data.lastName &&
            userCurrentState.data.info.major &&
            userCurrentState.data.info.major.id &&
            userCurrentState.data.info.grade &&
            userCurrentState.data.info.grade.id
    }

    function isVerified() {
        return userCurrentState.verified
    }

    function hasPurchasedProduct() {
        return userCurrentState.hasPurchasedProduct
    }

    return {
        setVerified,
        setHasPurchasedProduct,
        setData,
        getData,
        isLogin,
        isInformationCompleted,
        isVerified,
        hasPurchasedProduct
    };
}();

export default UserState