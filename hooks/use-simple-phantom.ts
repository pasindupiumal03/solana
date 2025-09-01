/**
 * Simple Phantom Wallet Hook - Student Version
 * 
 * This custom React hook manages the Phantom wallet connection state.
 * It's simplified for educational purposes with clear explanations.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import {
  connectWallet,
  disconnectWallet,
  isWalletConnected,
  getWalletAddress,
  getPhantomWallet,
  isPhantomInstalled,
} from "@/lib/simple-phantom"

/**
 * Custom hook for managing Phantom wallet connection
 * Returns wallet state and functions to connect/disconnect
 */
export function useSimplePhantomWallet() {
  // State variables to track wallet status
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Function to check the current wallet connection status
   * useCallback prevents unnecessary re-renders
   */
  const checkWalletConnection = useCallback(() => {
    const connected = isWalletConnected()
    const address = getWalletAddress()
    
    setIsConnected(connected)
    setWalletAddress(address)
  }, [])

  /**
   * useEffect runs when component mounts
   * Sets up wallet event listeners and checks initial connection
   */
  useEffect(() => {
    // Check initial connection status
    checkWalletConnection()

    // Set up event listeners for wallet events
    const wallet = getPhantomWallet()
    if (wallet) {
      // When wallet connects
      const handleConnect = () => {
        console.log("Wallet connected!")
        checkWalletConnection()
      }

      // When wallet disconnects
      const handleDisconnect = () => {
        console.log("Wallet disconnected!")
        setIsConnected(false)
        setWalletAddress(null)
      }

      // Add event listeners
      wallet.on("connect", handleConnect)
      wallet.on("disconnect", handleDisconnect)

      // Cleanup function - removes event listeners when component unmounts
      return () => {
        wallet.off("connect", handleConnect)
        wallet.off("disconnect", handleDisconnect)
      }
    }
  }, [checkWalletConnection])

  /**
   * Function to connect the wallet
   * Shows loading state and handles errors
   */
  const connect = async () => {
    // Check if Phantom is installed
    if (!isPhantomInstalled()) {
      setError("Phantom wallet not found. Please install Phantom extension.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Attempt to connect
      const address = await connectWallet()
      
      // Update state on success
      setWalletAddress(address)
      setIsConnected(true)
      console.log("Successfully connected to wallet:", address)
      
    } catch (err) {
      // Handle connection errors
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet"
      setError(errorMessage)
      console.error("Connection failed:", errorMessage)
      
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Function to disconnect the wallet
   */
  const disconnect = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await disconnectWallet()
      
      // Update state
      setIsConnected(false)
      setWalletAddress(null)
      console.log("Wallet disconnected successfully")
      
    } catch (err) {
      // Handle disconnection errors
      const errorMessage = err instanceof Error ? err.message : "Failed to disconnect wallet"
      setError(errorMessage)
      console.error("Disconnection failed:", errorMessage)
      
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Function to clear any error messages
   */
  const clearError = () => {
    setError(null)
  }

  // Return all state and functions for components to use
  return {
    // State
    isConnected,
    walletAddress,
    isLoading,
    error,
    isPhantomInstalled: isPhantomInstalled(),
    
    // Functions
    connect,
    disconnect,
    clearError,
  }
}
