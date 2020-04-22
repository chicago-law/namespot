import { css } from './styledComponents'

type AnimationNames =
  | 'fadeSlideUp'
  | 'fadeSlideDown'
  | 'slideRight'
  | 'fadeSlideRight'
  | 'slideLeft'
  | 'slideDown'
  | 'fadeExpand'
  | 'spin';

const animateEntrance = (
  name: AnimationNames,
  duration?: number,
  delay?: number,
) => {
  switch (name) {
    case 'fadeSlideUp': return css`
      animation: moveToPosition ${duration || '1000'}ms ease-in-out forwards;
      animation-delay: ${delay || '200'}ms;
      opacity: 0;
      transform: translateY(0.65em);
    `
    case 'fadeSlideDown': return css`
      animation: moveToPosition ${duration || '1000'}ms ease-in-out forwards;
      animation-delay: ${delay || '200'}ms;
      opacity: 0;
      transform: translateY(-0.65em);
    `
    case 'slideRight': return css`
      animation: moveToPosition ${duration || '500'}ms ease-in-out forwards;
      animation-delay: ${delay || '100'}ms;
      transform: translateX(-100%);
    `
    case 'fadeSlideRight': return css`
      animation: moveToPosition ${duration || '500'}ms ease-in-out forwards;
      animation-delay: ${delay || '100'}ms;
      opacity: 0;
      transform: translateX(-100%);
    `
    case 'slideLeft': return css`
      animation: moveToPosition ${duration || '500'}ms ease-in-out forwards;
      animation-delay: ${delay || '100'}ms;
      transform: translateX(100%);
    `
    case 'slideDown': return css`
      animation: moveToPosition ${duration || '500'}ms ease-in-out forwards;
      animation-delay: ${delay || '100'}ms;
      transform: translateY(-100%);
    `
    case 'fadeExpand': return css`
      animation: moveToPosition ${duration || '300'}ms ease-in-out forwards;
      animation-delay: ${delay || '0'};;
      opacity: 0;
      transform: scale(0.5);
    `
    case 'spin': return css`
      animation: spin ${duration || '750'}ms infinite ease-in-out;
    `
    default: return ''
  }
}

export default animateEntrance
