export interface HasFullPosition {
    atTop(): this;
    atBottom(): this;
    atLeft(): this;
    atRight(): this;
    atTopLeading(): this;
    atTopTrailing(): this;
    atTopCenter(): this;
    atBottomLeading(): this;
    atBottomTrailing(): this;
    atBottomCenter(): this;
    atLeadingCenter(): this;
    atTrailingCenter(): this;
}
