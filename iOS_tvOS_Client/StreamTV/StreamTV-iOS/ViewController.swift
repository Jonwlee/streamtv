//
//  ViewController.swift
//  StreamTV-iOS
//
//  Created by Bogdan Vitoc on 1/22/16.
//  Copyright © 2016 Bogdan Vitoc. All rights reserved.
//

import UIKit
import SocketIOClientSwift

class ViewController: UIViewController {

    @IBOutlet weak var imageView: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let socket = SocketIOClient(socketURL: "10.251.94.93:3000", options: [.Log(true), .ForcePolling(true)])
        
        socket.on("connect") {data, ack in
            print("socket connected")
            socket.emit("start-stream", "hello evan")
        }

        socket.on("liveStream") {data, ack in
            if let bytes = data[0] as? String {
                let data = NSData(base64EncodedString: bytes, options: NSDataBase64DecodingOptions.IgnoreUnknownCharacters)
                self.imageView.image = UIImage(data: data!)
            }
        }
        
        socket.connect()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func websocketDidConnect(socket: WebSocket) {
        
    }

}

