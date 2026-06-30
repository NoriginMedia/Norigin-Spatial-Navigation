import { getBoundingClientRect } from '../measureLayout';
import { type FocusableComponent } from '../SpatialNavigation';
import BaseWebAdapter from './web';

export default class GetBoundingClientRectAdapter extends BaseWebAdapter {
  measureLayout = async (component: FocusableComponent) => ({
    ...getBoundingClientRect(component.node),
    node: component.node
  });
}
