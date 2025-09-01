
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://data.solanatracker.io"

export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{address: string}>}

){
    const {address} = await params;

    if(!address){
        return NextResponse.json({}, {status: 400})
    }

    try{
        const response = await fetch(`${BASE_URL}/wallet/${address}`,{
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'SolanaTracker',
                'x-api-key': process.env.SOLANA_TRACKER_API_KEY || '',
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
                return NextResponse.json({}, {status: 500})
            }
            return NextResponse.json({}, {status: response.status})
        }

        const data = await response.json();
        return NextResponse.json(data,{
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        })
    } catch {
        return NextResponse.json({}, {status: 500})
    }
}

export async function OPTIONS(){
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}