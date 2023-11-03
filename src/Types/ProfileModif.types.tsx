export default interface UserProfileData {
  phoneNumber: number
  userName: string
  email: string
  address: string
  city?: string | undefined
  yearBirth: number
  _id?: string
}
