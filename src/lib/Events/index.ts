export default function EventMap<T extends Event>(parent: Window|HTMLElement, event:string, callback:((e:T) => void)[]){
    const listener = parent.addEventListener(event, (e:Event) => {
        for(let i=0; i<callback.length; i++){
            callback[i](e as T);
        }
    })
    return listener
}
