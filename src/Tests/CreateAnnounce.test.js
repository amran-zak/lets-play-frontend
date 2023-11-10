// CreateAnnounce.test.js
import { mount } from 'enzyme'
import CreateAnnounce from '../Components/Organizer/CreateAnnounce'

describe('CreateAnnounce component', () => {
  it('renders without crashing', () => {
    const wrapper = mount(<CreateAnnounce />)
    expect(wrapper).toBeDefined()
  })

  // Ajoutez d'autres tests selon vos besoins
})
