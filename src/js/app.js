document.addEventListener('DOMContentLoaded', function () {
  const triggerButton = document.getElementById('popover-trigger')
  const popover = document.getElementById('popover')
  let isPopoverVisible = false

  function showPopover() {
    // Получаем положение кнопки
    const buttonRect = triggerButton.getBoundingClientRect()

    // Вычисляем положение popover
    const popoverWidth = 276
    const popoverHeight = 130
    const popoverLeft = buttonRect.left + (buttonRect.width / 2) - (popoverWidth / 2)

    // Располагаем popover сверху
    const popoverTop = buttonRect.top - popoverHeight - 10

    // Устанавливаем положение popover
    popover.style.left = popoverLeft + 'px'
    popover.style.top = popoverTop + 'px'

    // Показываем popover
    popover.classList.add('show')
    isPopoverVisible = true
  }

  // Функция для скрытия popover
  function hidePopover() {
    popover.classList.remove('show')
    isPopoverVisible = false
  }

  // Функция для переключения popover
  function togglePopover() {
    if (isPopoverVisible) {
      hidePopover()
    } else {
      showPopover()
    }
  }

  // Добавляем обработчик клика на кнопку
  triggerButton.addEventListener('click', togglePopover)

  // Закрываем popover при клике вне области
  document.addEventListener('click', function (event) {
    // Если клик не по кнопке и не по popover
    if (!triggerButton.contains(event.target) && !popover.contains(event.target) && isPopoverVisible) {
      hidePopover()
    }
  })

  // Обновляем положение popover при изменении размера окна
  window.addEventListener('resize', function () {
    if (isPopoverVisible) {
      showPopover()
    }
  })
})