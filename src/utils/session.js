import authUtil from './security'

const session = {
  setValue (key, value) {
    sessionStorage.setItem(key, value)
  },
  getValue (key) {
    return sessionStorage.getItem(key)
  },
  getAuthTocken () {
    return this.getValue('authTocken')
  },
  setAuthTocken (tocken) {
    return this.setValue('authTocken', tocken)
  },
  getUserInfo () {
    const encUserInfo = this.getValue('userInfo')
    if (encUserInfo == null) {
      return null
    }
    const userInfo = authUtil.decryptstring(encUserInfo)
    return JSON.parse(userInfo)
  },
  setUserInfo (userInfo) {
    const encUserInfo = authUtil.encryptstring(JSON.stringify(userInfo))
    return this.setValue('userInfo', encUserInfo)
  },

  removeValue (key) {
    sessionStorage.removeItem(key)
  },

  removeAuth () {
    this.removeValue('authTocken')
    this.removeValue('userInfo')
  },
  setCurrentSiteId (siteId) {
    return this.setValue('currentSiteId', siteId)
  },
  setCurrentSiteName (siteName) {
    return this.setValue('currentSiteName', siteName)
  },
  getCurrentSiteId () {
    return this.getValue('currentSiteId')
  },
  getCurrentSiteName () {
    return this.getValue('currentSiteName')
  },
  setLanguage (lang) {
    return this.setValue('currentLanguage', lang)
  },
  getLanguage () {
    return this.getValue('currentLanguage')
  }
}

export default session
