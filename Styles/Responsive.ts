import{moderateScale, scale, verticalScale}from"react-native-size-matters"


export const rs = (size : number)=>{
    return scale(size)
}

export const rVs = (size : number)=>{
    return verticalScale(size)
}

export const rMs = (size : number,factor?:number)=>{
    return moderateScale(size,factor)
}