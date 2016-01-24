//
//  DataReceiver.swift
//  StreamTV
//
//  Created by Bogdan Vitoc on 1/24/16.
//  Copyright © 2016 Bogdan Vitoc. All rights reserved.
//

import UIKit

#if os(iOS)
import SocketIOClientSwift
#elseif os(tvOS)
import SocketIO
#endif

public class DataReceiver {
    
    static let sharedReceiver = DataReceiver()
    let socket: SocketIOClient
    var imageClosures: [(image: UIImage?) -> Void] = []
    
    init () {
        socket =  SocketIOClient(socketURL: "192.168.1.38:3000", options: [.Log(false), .ForcePolling(true)])
        
        socket.on("connect") {data, ack in
            print("socket connected")
            self.socket.emit("start-stream", "hello evan")
        }
        
        socket.on("liveStream") {data, ack in
            
            if let bytes = data[0] as? String {
                if let data = NSData(base64EncodedString: bytes, options: NSDataBase64DecodingOptions.IgnoreUnknownCharacters) {
                    for closure in self.imageClosures {
                        closure(image: UIImage(data: data))
                    }
                }
            }
            
        }
        
        socket.connect()
    }
    
    public func receiveImages(closure: (image: UIImage?) -> Void) {
        imageClosures.append(closure)
    }
    
}
