import Button from './Button';

export default function ResetButton(content, props) {
    return Button(content, props).type('reset');
}