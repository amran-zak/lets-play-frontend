export default interface UserData {
  phoneNumber: string
  userName: string
  email: string
  password: string
  address: string
  city?: string | undefined
  yearBirth: number
  _id?: string
}
