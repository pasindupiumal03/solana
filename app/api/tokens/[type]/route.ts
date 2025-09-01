import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://data.solanatracker.io"
const API_KEY = process.env.SOLANA_TRACKER_API_KEY

type TokenType = "trending" | "latest" | "volume" | "graduated"

const getEndpointUrl = (type: TokenType): string => {
    switch (type){
        case "trending":
            return `${BASE_URL}/tokens/trending`
        case "latest":
            return `${BASE_URL}/tokens/latest`
        case "volume":
            return `${BASE_URL}/tokens/volume`
        case "graduated":
            return `${BASE_URL}/tokens/graduated`
        default:
            return `${BASE_URL}/tokens/trending`
    }
}

export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{type: string}>}
){
    const {type} = await params

    const validTypes: TokenType[] = ["trending", "latest", "volume", "graduated"]
    if (!validTypes.includes(type as TokenType)){
        return NextResponse.json({}, {status: 400})
    }

    if (!API_KEY) {
        return NextResponse.json({}, {status: 500})
    }
    try{
        const endpoint = getEndpointUrl(type as TokenType)

        const response = await fetch(endpoint,{
            method: "GET",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY,
                'User-Agent': 'Solana Tracker'
            },
        })

        if(!response.ok){
            if(response.status === 401){
                return NextResponse.json({}, {status: 401})
            }else if (response.status === 404){
                return NextResponse.json({}, {status: 404})
            }
            else if (response.status === 429){
                return NextResponse.json({}, {status: 429})
            }
            else if (response.status >= 500){
                return NextResponse.json({}, {status: 502})
            }
            return NextResponse.json({}, {status: response.status})
        }

        const data = await response.json();
        return NextResponse.json({tokens:data},{
            headers:{
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        })
    } catch {
        return NextResponse.json({}, {status: 500})
    }
}

export async function OPTIONS(request: NextRequest){
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}
