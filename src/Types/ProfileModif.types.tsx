export default interface UserProfileData {
  phoneNumber: string
  userName: string
  email: string
  address: string
  city?: string | undefined
  yearBirth: number
  _id?: string
}
