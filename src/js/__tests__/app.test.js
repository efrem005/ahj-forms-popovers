/**
 * Автотесты виджета Popover
 */

// Подготавливаем DOM до загрузки app.js
document.body.innerHTML = `
  <button id="popover-trigger">Нажмите</button>
  <div id="popover" class="popover"></div>
`

require('../app')

describe('Popover виджет', () => {
  let triggerButton
  let popover

  beforeAll(() => {
    document.dispatchEvent(new Event('DOMContentLoaded'))
    triggerButton = document.getElementById('popover-trigger')
    popover = document.getElementById('popover')
  })

  beforeEach(() => {
    if (popover.classList.contains('show')) {
      triggerButton.click()
    }
    popover.style.left = ''
    popover.style.top = ''
  })

  describe('инициализация', () => {
    it('находит кнопку и popover по id', () => {
      expect(triggerButton).not.toBeNull()
      expect(popover).not.toBeNull()
    })
  })

  describe('showPopover', () => {
    it('показывает popover и задаёт положение в px при клике по кнопке', () => {
      const left = 50
      const top = 200
      const width = 120
      triggerButton.getBoundingClientRect = jest.fn(() => ({
        left,
        top,
        width,
        height: 40,
        right: left + width,
        bottom: top + 40,
        x: left,
        y: top,
        toJSON: () => ({}),
      }))

      triggerButton.click()

      expect(popover.classList.contains('show')).toBe(true)
      expect(popover.style.left).toBe(`${left + width / 2 - 276 / 2}px`)
      expect(popover.style.top).toBe(`${top - 130 - 10}px`)
    })
  })

  describe('hidePopover', () => {
    it('скрывает popover при повторном клике по кнопке', () => {
      triggerButton.getBoundingClientRect = jest.fn(() => ({
        left: 0, top: 0, width: 100, height: 40,
        right: 100, bottom: 40, x: 0, y: 0, toJSON: () => ({}),
      }))

      triggerButton.click()
      expect(popover.classList.contains('show')).toBe(true)

      triggerButton.click()
      expect(popover.classList.contains('show')).toBe(false)
    })
  })

  describe('togglePopover', () => {
    it('при первом клике вызывает showPopover (показ)', () => {
      triggerButton.getBoundingClientRect = jest.fn(() => ({
        left: 10, top: 10, width: 100, height: 40,
        right: 110, bottom: 50, x: 10, y: 10, toJSON: () => ({}),
      }))

      triggerButton.click()
      expect(popover.classList.contains('show')).toBe(true)
    })

    it('при втором клике вызывает hidePopover (скрытие)', () => {
      triggerButton.getBoundingClientRect = jest.fn(() => ({
        left: 10, top: 10, width: 100, height: 40,
        right: 110, bottom: 50, x: 10, y: 10, toJSON: () => ({}),
      }))

      triggerButton.click()
      triggerButton.click()
      expect(popover.classList.contains('show')).toBe(false)
    })
  })

  describe('клик вне области (документ)', () => {
    it('закрывает popover при клике вне кнопки и вне popover, если popover виден', () => {
      triggerButton.getBoundingClientRect = jest.fn(() => ({
        left: 0, top: 0, width: 100, height: 40,
        right: 100, bottom: 40, x: 0, y: 0, toJSON: () => ({}),
      }))

      triggerButton.click()
      expect(popover.classList.contains('show')).toBe(true)

      const outside = document.createElement('div')
      document.body.appendChild(outside)
      outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      document.body.removeChild(outside)

      expect(popover.classList.contains('show')).toBe(false)
    })

    it('не закрывает popover при клике по кнопке (переключение обрабатывается отдельно)', () => {
      triggerButton.getBoundingClientRect = jest.fn(() => ({
        left: 0, top: 0, width: 100, height: 40,
        right: 100, bottom: 40, x: 0, y: 0, toJSON: () => ({}),
      }))

      triggerButton.click()
      triggerButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      // После двух кликов — скрыт
      expect(popover.classList.contains('show')).toBe(false)
    })

    it('не закрывает popover при клике по самому popover', () => {
      triggerButton.getBoundingClientRect = jest.fn(() => ({
        left: 0, top: 0, width: 100, height: 40,
        right: 100, bottom: 40, x: 0, y: 0, toJSON: () => ({}),
      }))

      triggerButton.click()
      expect(popover.classList.contains('show')).toBe(true)

      popover.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(popover.classList.contains('show')).toBe(true)
    })

    it('не вызывает hidePopover при клике вне области, если popover уже скрыт', () => {
      const outside = document.createElement('div')
      document.body.appendChild(outside)
      outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      document.body.removeChild(outside)
      expect(popover.classList.contains('show')).toBe(false)
    })
  })

  describe('resize', () => {
    it('обновляет положение popover при resize, если popover виден', () => {
      triggerButton.getBoundingClientRect = jest.fn(() => ({
        left: 100, top: 100, width: 100, height: 40,
        right: 200, bottom: 140, x: 100, y: 100, toJSON: () => ({}),
      }))

      triggerButton.click()
      expect(popover.style.left).toBe('12px')
      expect(popover.style.top).toBe('-40px')

      triggerButton.getBoundingClientRect = jest.fn(() => ({
        left: 200, top: 200, width: 100, height: 40,
        right: 300, bottom: 240, x: 200, y: 200, toJSON: () => ({}),
      }))

      window.dispatchEvent(new Event('resize'))
      expect(popover.style.left).toBe('112px')
      expect(popover.style.top).toBe('60px')
    })

    it('не пересчитывает положение при resize, если popover скрыт', () => {
      // Убеждаемся, что popover скрыт (не кликаем и не показываем)
      expect(popover.classList.contains('show')).toBe(false)
      const leftBefore = popover.style.left
      const topBefore = popover.style.top

      window.dispatchEvent(new Event('resize'))
      // Стили не должны измениться (остаются пустыми или прежними)
      expect(popover.style.left).toBe(leftBefore)
      expect(popover.style.top).toBe(topBefore)
    })
  })
})
