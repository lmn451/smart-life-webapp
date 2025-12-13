import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/App.vue'

describe('App.vue', () => {
  it('renders router-view', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          RouterView: true
        }
      }
    })

    expect(wrapper.find('router-view-stub').exists()).toBe(true)
  })

  it('has correct structure', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          RouterView: true
        }
      }
    })

    // App.vue renders router-view directly without wrapper div
    expect(wrapper.html()).toContain('router-view-stub')
  })
})
