import {
  animate,
  animateChild,
  group,
  query as q,
  stagger,
  style,
  state,
  transition,
  trigger
} from "@angular/animations";

const query = (s, a, o = { optional: true }) => q(s, a, o);

export const fadeAnimation = trigger("fadeAnimation", [
  state(
    "void",
    style({
      transform: "scale(0.5)",
      opacity: 0
    })
  ),
  state(
    "*",
    style({
      transform: "scale(1)",
      opacity: 1
    })
  ),
  transition("void <=> *", animate("500ms ease-in-out"))
]);


export const listanim = trigger('listanim', [
  transition(':enter', [
    query('@listitemanim', stagger(200, animateChild()))
  ]),
]);

export const listitemanim = trigger('listitemanim', [
  // cubic-bezier for a tiny bouncing feel
  transition(':enter', [
    style({ transform: 'scale(0.1)', opacity: 0 }),
    animate('1s cubic-bezier(.8,-0.6,0.2,1.5)',
      style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'scale(1)', opacity: 1, height: '*' }),
    animate('1s cubic-bezier(.8,-0.6,0.2,1.5)',
      style({ transform: 'scale(0.2)', opacity: 0, height: '0px', margin: '0px' }))
  ]),
]);

export const listAnimation = trigger("listAnimation", [
  transition("* => *", [
    // each time the binding value changes
    query(":leave", [stagger(200, [animate("0.2s", style({ opacity: 0 }))])], {
      optional: true
    }),
    query(
      ":enter",
      [
        style({ opacity: 0 }),
        stagger(200, [animate("0.2s", style({ opacity: 1 }))])
      ],
      { optional: true }
    )
  ])
]);

export const actionAnimation = trigger("actionAnimation", [
  state(
    "orig",
    style({
      transform: "scale(1)",
      opacity: 1
    })
  ),
  state(
    "small",
    style({
      transform: "scale(0.75)",
      opacity: 0.3
    })
  ),
  transition("* => *", animate("500ms ease-in-out"))
]);


export const openClose = trigger("openClose", [
  state('open', style({
    'max-height': '60%',
    opacity: 1,
    backgroundColor: 'white'
  })),
  state('closed', style({
    'max-height': '10%',
    opacity: 0.5,
    overflow: 'hidden'
    //backgroundColor: 'gray'
  })),
  transition('open <=> closed', [
    animate('0.3s')
  ])
]);



export const slidePanel = trigger('slidePanel', [
  state('leave', style({
    //flex: '0 0 100%',
    width: '0px'
  })),
  state('enter', style({
    //flex: '1',
    width: '100%'
  })),
  transition('* => leave',
    animate('1300ms cubic-bezier(0.35, 0, 0.25, 1)'),
  ),
  transition('* => enter',
    animate('1400ms cubic-bezier(0.35, 0, 0.25, 1)'),
  )
]);


export const slidePanel1 =
  trigger('slidePanel1', [
    state('void', style({
      //flex: '0 0 100%',
      width: '0px'
    })),
    state('*', style({
      //flex: '1',
      width: '100%'
    })),
    transition('* => void',
      animate('1300ms'),
    ),
    transition('void => *',
      animate('1400ms'),
    )
  ]);

export const draweranimation = trigger('draweranimation', [
  state('leave', style({
    flex: '0 0 100%',
    width: '60px'
  })),
  state('enter', style({
    flex: '1',
    width: '260px'
  })),
  transition('* => leave',
    animate('1300ms cubic-bezier(0.35, 0, 0.25, 1)'),
  ),
  transition('* => enter',
    animate('1400ms cubic-bezier(0.35, 0, 0.25, 1)'),
  )
]);

export const drawercontentanimation = trigger('drawercontentanimation', [
  state('leave', style({
    flex: '0 0 100%',
    'margin-left': '60px'
  })),
  state('enter', style({
    flex: '1',
    'margin-left': '260px'
  })),
  transition('* => leave',
    animate('1300ms cubic-bezier(0.35, 0, 0.25, 1)'),
  ),
  transition('* => enter',
    animate('1400ms cubic-bezier(0.35, 0, 0.25, 1)'),
  )
]);


export const filterPanelanimation = trigger('filterPanelanimation', [
  state('leave', style({
    flex: '0 0 100%',
    width: '0px'
  })),
  state('enter', style({
    flex: '1',
    width: '260px'
  })),
  transition('* => leave',
    animate('1300ms cubic-bezier(0.35, 0, 0.25, 1)'),
  ),
  transition('* => enter',
    animate('1400ms cubic-bezier(0.35, 0, 0.25, 1)'),
  )
]);


export const filtercontentanimation = trigger('filtercontentanimation', [
  state('leave', style({
    flex: '0 0 100%',

  })),
  state('enter', style({
    flex: '1',
    'margin-right': '260px'
  })),
  transition('* => leave',
    animate('1300ms cubic-bezier(0.35, 0, 0.25, 1)'),
  ),
  transition('* => enter',
    animate('1400ms cubic-bezier(0.35, 0, 0.25, 1)'),
  )
]);

export const searchAnimation =
  trigger('searchAnimation', [
    state('void', style({
      //flex: '0 0 100%',
      width: '0px'
    })),
    state('*', style({
      //flex: '1',
      width: '100%'
    })),
    transition('* => void',
      animate('2300ms'),
    ),
    transition('void => *',
      animate('2400ms'),
    )
  ]);
