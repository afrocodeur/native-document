import Button from './Button';

export default function SubmitButton(content, props){
    return Button(content, props).type('submit');
}