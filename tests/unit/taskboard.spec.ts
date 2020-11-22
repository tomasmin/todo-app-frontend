import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import TaskBoard from "@/components/TaskBoard.vue";
import BootstrapVue, { IconsPlugin } from 'bootstrap-vue';

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(IconsPlugin)

const factory = (values = {}) => {
  return shallowMount(TaskBoard, { localVue,
    data () {
      return {
        ...values
      }
    }
  })
}

describe("TaskBoard.vue", () => {
  it("displays name error", () => {
    const wrapper = factory({ nameError: 'Name too long'  })
    expect(wrapper.find('.error-msg').text()).toEqual("Name too long")
  })

  it("displays item in to do list", () => {
    const wrapper = factory({ toDoList: [{"description": "asdad", "id": 34, "is_done": false, "name": "asdasdasd"}]  })
    expect(wrapper.find('.todo-item').exists()).toBeTruthy()
  })

  it("displays item in done list", () => {
    const wrapper = factory({ doneList: [{"description": "asdad", "id": 34, "is_done": true, "name": "asdasdasd"}]  })
    expect(wrapper.find('.done-item').exists()).toBeTruthy()
  })
})
