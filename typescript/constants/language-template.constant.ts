import { TEMPLATE_STRINGS } from './template-strings.constant';

export const LANGUAGE_TEMPLATE = {
  PROGRESS: `
              <span style="background-color: {{ ${TEMPLATE_STRINGS.LANGUAGE_COLOR} }}; width:{{ ${TEMPLATE_STRINGS.LANGUAGE_PERCENTAGE} }}%;" class="progress-item"></span>
  `,
  LANGUAGE_LIST: `
            <li style="animation-delay: {{ ${TEMPLATE_STRINGS.ANIMATION_DELAY} }}ms;">
              <svg xmlns="http://www.w3.org/2000/svg" class="language-item" style="fill:{{ ${TEMPLATE_STRINGS.LANGUAGE_COLOR} }};" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path>
              </svg>
              <span class="language-name">{{ ${TEMPLATE_STRINGS.LANGUAGE_NAME} }}</span>
              <span class="language-percent">{{ ${TEMPLATE_STRINGS.LANGUAGE_PERCENTAGE} }}%</span>
            </li>
  `,
};
