import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLogo from '@/components/AppLogo.vue'

describe('AppLogo', () => {
  it('renders the logo SVG', () => {
    const wrapper = mount(AppLogo)
    const svg = wrapper.find('svg')
    
    expect(svg.exists()).toBe(true)
    expect(svg.classes()).toContain('logo-svg')
  })

  it('renders the logo title', () => {
    const wrapper = mount(AppLogo)
    const title = wrapper.find('.logo-title')
    
    expect(title.exists()).toBe(true)
    expect(title.text()).toContain('Smart')
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(AppLogo)
    expect(wrapper.classes()).toContain('app-logo')
  })

  it('has correct aria-label', () => {
    const wrapper = mount(AppLogo)
    expect(wrapper.attributes('aria-label')).toBe('Smart Life Logo')
  })

  it('matches snapshot', () => {
    const wrapper = mount(AppLogo)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
